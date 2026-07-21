import React, { useEffect, useMemo, useState } from 'react';
import type {
    ContentOverride,
    OverrideBlockType,
    OverridePosition,
    PublicQuizQuestion,
} from '../../services/contentOverrides';
import {
    buildPublicQuizPayload,
    deleteOverride,
    isShippedVanguardQuizId,
    parsePublicQuizPayload,
    publishVanguardQuizOverride,
    removeVanguardQuizOverride,
    upsertOverride,
} from '../../services/contentOverrides';
import { notifyContentOverridesChanged } from '../../hooks/useContentOverrides';
import ContentBlockRenderer from './ContentBlockRenderer';
import { useEditMode } from './EditModeContext';
import { getShippedQuizQuestions } from '../SectionQuiz';

interface Props {
    existing?: ContentOverride | null;
}

const BLOCK_TYPES: { value: OverrideBlockType; label: string; hint: string }[] = [
    { value: 'rich_text', label: 'Rich text / Markdown', hint: 'Formatted lesson copy, notes, or intros.' },
    { value: 'embed_url', label: 'Embed URL (iframe)', hint: 'Any URL — ZEN Arena, tools, forms, dashboards.' },
    { value: 'video', label: 'Video', hint: 'YouTube, Vimeo, Loom, or direct MP4 URL.' },
    { value: 'image', label: 'Image', hint: 'Diagram, screenshot, or photo URL.' },
    { value: 'html', label: 'Custom HTML (sandboxed)', hint: 'Interactive widget — runs inside a sandboxed iframe.' },
    { value: 'link_card', label: 'Link card', hint: 'External resource — opens in a new tab.' },
    { value: 'divider', label: 'Divider', hint: 'Section break with optional label.' },
    { value: 'quiz', label: 'Quiz / assessment', hint: 'Required, server-scored questions with private correct choices.' },
];

const emptyQuizQuestion = (): PublicQuizQuestion => ({ question: '', options: ['', ''], explanation: '' });

const quizModuleNumber = (moduleId: string): 1 | 2 | 3 | 4 => {
    const match = moduleId.match(/^module([1-4])$/);
    return (match ? Number(match[1]) : 1) as 1 | 2 | 3 | 4;
};

const newQuizId = (moduleId: string) => {
    const suffix = typeof crypto !== 'undefined' && 'randomUUID' in crypto
        ? crypto.randomUUID().replace(/-/g, '').slice(0, 8)
        : Math.random().toString(36).slice(2, 10);
    return `quiz-${quizModuleNumber(moduleId)}-custom-${suffix}`;
};

const BlockEditorModal: React.FC<Props> = ({ existing }) => {
    const { editorState, closeEditor, programId, moduleId } = useEditMode();
    const [blockType, setBlockType] = useState<OverrideBlockType>('rich_text');
    const [payload, setPayload] = useState<Record<string, any>>({});
    const [sortOrder, setSortOrder] = useState<number>(0);
    const [isPublished, setIsPublished] = useState(false);
    const [saving, setSaving] = useState(false);
    const [quizId, setQuizId] = useState('');
    const [quizQuestions, setQuizQuestions] = useState<PublicQuizQuestion[]>([emptyQuizQuestion()]);
    const [quizCorrectIndexes, setQuizCorrectIndexes] = useState<Array<number | null>>([null]);
    const [quizPassingPercent, setQuizPassingPercent] = useState(60);

    // Initialise fields when opening
    useEffect(() => {
        if (!editorState) return;
        if (existing) {
            setBlockType(existing.block_type);
            setPayload(existing.payload ?? {});
            setSortOrder(existing.sort_order);
            setIsPublished(existing.is_published);
            if (existing.block_type === 'quiz') {
                const quiz = parsePublicQuizPayload(existing.payload);
                const shippedQuestions = quiz ? getShippedQuizQuestions(quiz.quiz_id) : [];
                const questions = quiz?.questions.length ? quiz.questions : shippedQuestions;
                setQuizId(quiz?.quiz_id ?? newQuizId(editorState.moduleId));
                setQuizQuestions(questions.length ? questions : [emptyQuizQuestion()]);
                setQuizCorrectIndexes(Array(Math.max(questions.length, 1)).fill(null));
                setQuizPassingPercent(quiz?.passing_percent ?? 60);
            }
        } else {
            setBlockType('rich_text');
            setPayload({});
            setSortOrder(0);
            setIsPublished(false);
            setQuizId(newQuizId(editorState.moduleId));
            setQuizQuestions([emptyQuizQuestion()]);
            setQuizCorrectIndexes([null]);
            setQuizPassingPercent(60);
        }
    }, [editorState, existing]);

    const previewOverride = useMemo<ContentOverride>(() => ({
        id: existing?.id ?? 'preview',
        program_id: programId,
        module_id: moduleId,
        section_id: editorState?.sectionId ?? null,
        position: (editorState?.position ?? 'after') as OverridePosition,
        block_type: blockType,
        payload: blockType === 'quiz'
            ? buildPublicQuizPayload(quizId, quizQuestions, quizPassingPercent)
            : payload,
        sort_order: sortOrder,
        is_published: blockType === 'quiz' ? true : isPublished,
        created_by: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
    }), [existing?.id, programId, moduleId, editorState, blockType, payload, quizId, quizPassingPercent, quizQuestions, sortOrder, isPublished]);

    if (!editorState) return null;

    const existingQuiz = existing?.block_type === 'quiz'
        ? parsePublicQuizPayload(existing.payload)
        : null;
    const restoresShippedQuiz = Boolean(existingQuiz && isShippedVanguardQuizId(existingQuiz.quiz_id));

    const save = async (publish: boolean) => {
        if (blockType === 'quiz' && !publish) {
            alert('Quiz answer choices are never stored in drafts. Publish atomically when every correct choice is selected.');
            return;
        }
        if (blockType === 'quiz') {
            const invalidQuestion = quizQuestions.some((question) => (
                !question.question.trim()
                || question.options.length < 2
                || question.options.some((option) => !option.trim())
            ));
            const missingCorrectChoice = quizCorrectIndexes.some((index, questionIndex) => (
                index === null || index < 0 || index >= quizQuestions[questionIndex].options.length
            ));
            if (!quizId.trim() || invalidQuestion || missingCorrectChoice) {
                alert('Complete every question and option, then select one correct choice for each question.');
                return;
            }
        }
        setSaving(true);
        const saved = blockType === 'quiz'
            ? await publishVanguardQuizOverride({
                id: existing?.id,
                moduleId: editorState.moduleId,
                sectionId: editorState.sectionId,
                position: editorState.position,
                sortOrder,
                quizId,
                questions: quizQuestions,
                correctOptionIndexes: quizCorrectIndexes.map((index) => index ?? -1),
                passingPercent: quizPassingPercent,
            })
            : await upsertOverride({
                id: existing?.id,
                program_id: editorState.programId,
                module_id: editorState.moduleId,
                section_id: editorState.sectionId,
                position: editorState.position,
                block_type: blockType,
                payload,
                sort_order: sortOrder,
                is_published: publish,
            });
        setSaving(false);
        if (saved) {
            notifyContentOverridesChanged();
            closeEditor();
        } else {
            alert('Could not save. Check the browser console for details.');
        }
    };

    const remove = async () => {
        if (!existing) return;
        const confirmation = existing.block_type !== 'quiz'
            ? 'Delete this content block? This cannot be undone.'
            : restoresShippedQuiz
                ? 'Restore this quiz to the shipped questions and private scoring definition? Learners will need to pass the restored revision.'
                : 'Remove this quiz? Its private scoring definition will be deactivated so learners are not blocked.';
        if (!confirm(confirmation)) return;
        const ok = existing.block_type === 'quiz'
            ? await removeVanguardQuizOverride(existing.id)
            : await deleteOverride(existing.id);
        if (ok) {
            notifyContentOverridesChanged();
            closeEditor();
        }
    };

    const setField = (key: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
        setPayload((prev) => ({ ...prev, [key]: e.target.value }));

    const selectBlockType = (nextType: OverrideBlockType) => {
        if (nextType === 'quiz' && (editorState.position === 'replace' || editorState.position === 'hide')) {
            alert('Add quizzes before, after, or at module level. Replace/hide positions suppress assessment requirements.');
            return;
        }
        setBlockType(nextType);
        if (nextType === 'quiz' && !quizId) {
            setQuizId(newQuizId(editorState.moduleId));
            setQuizQuestions([emptyQuizQuestion()]);
            setQuizCorrectIndexes([null]);
        }
    };

    const updateQuizQuestion = (index: number, next: PublicQuizQuestion) => {
        setQuizQuestions((current) => current.map((question, questionIndex) => (
            questionIndex === index ? next : question
        )));
    };

    const removeQuizQuestion = (index: number) => {
        setQuizQuestions((current) => current.filter((_, questionIndex) => questionIndex !== index));
        setQuizCorrectIndexes((current) => current.filter((_, questionIndex) => questionIndex !== index));
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-stretch justify-center overflow-y-auto bg-black/70 p-4 backdrop-blur-sm">
            <div className="my-auto w-full max-w-5xl overflow-hidden rounded-2xl border border-zen-gold/20 bg-[#080E1E] shadow-2xl">
                <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
                    <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.32em] text-zen-gold/80">
                            {existing ? 'Edit content block' : 'Add content block'}
                        </p>
                        <p className="mt-1 text-sm text-slate-400">
                            {editorState.programId} · {editorState.moduleId}
                            {editorState.sectionId ? ` · section: ${editorState.sectionId}` : ' · module-level'}
                            {` · position: ${editorState.position}`}
                        </p>
                    </div>
                    <button
                        onClick={closeEditor}
                        className="rounded-lg border border-white/10 px-3 py-1.5 text-sm text-slate-300 hover:bg-white/5"
                    >
                        Close
                    </button>
                </div>

                <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-2">
                    {/* Form */}
                    <div className="space-y-4">
                        <div>
                            <label className="mb-1 block text-xs font-semibold uppercase tracking-widest text-slate-400">Block type</label>
                            <select
                                value={blockType}
                                onChange={(e) => selectBlockType(e.target.value as OverrideBlockType)}
                                disabled={existing?.block_type === 'quiz'}
                                className="w-full rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-sm text-slate-100"
                            >
                                {BLOCK_TYPES.filter((type) => (
                                    !existing
                                    || (existing.block_type === 'quiz' ? type.value === 'quiz' : type.value !== 'quiz')
                                )).map((t) => (
                                    <option
                                        key={t.value}
                                        value={t.value}
                                        disabled={t.value === 'quiz' && (editorState.position === 'replace' || editorState.position === 'hide')}
                                    >
                                        {t.label}
                                    </option>
                                ))}
                            </select>
                            <p className="mt-1 text-xs text-slate-500">
                                {existing?.block_type === 'quiz'
                                    ? 'Quiz blocks stay quizzes so public copy and private scoring cannot drift.'
                                    : BLOCK_TYPES.find((t) => t.value === blockType)?.hint}
                            </p>
                        </div>

                        {(blockType === 'rich_text') && (
                            <TextField label="Markdown" value={payload.markdown ?? ''} onChange={setField('markdown')} multiline rows={10} />
                        )}
                        {blockType === 'html' && (
                            <>
                                <TextField label="Title (optional)" value={payload.title ?? ''} onChange={setField('title')} />
                                <TextField label="HTML" value={payload.html ?? ''} onChange={setField('html')} multiline rows={12} mono />
                                <TextField label="Height (px)" value={payload.height ?? ''} onChange={setField('height')} />
                            </>
                        )}
                        {blockType === 'embed_url' && (
                            <>
                                <TextField label="Title (optional)" value={payload.title ?? ''} onChange={setField('title')} />
                                <TextField label="URL" value={payload.url ?? ''} onChange={setField('url')} />
                                <TextField label="Height (px, optional — defaults 16:9)" value={payload.height ?? ''} onChange={setField('height')} />
                            </>
                        )}
                        {blockType === 'video' && (
                            <>
                                <TextField label="Title (optional)" value={payload.title ?? ''} onChange={setField('title')} />
                                <TextField label="Video URL" value={payload.url ?? ''} onChange={setField('url')} />
                                <TextField label="Caption (optional)" value={payload.caption ?? ''} onChange={setField('caption')} />
                            </>
                        )}
                        {blockType === 'image' && (
                            <>
                                <TextField label="Image URL" value={payload.url ?? ''} onChange={setField('url')} />
                                <TextField label="Alt text" value={payload.alt ?? ''} onChange={setField('alt')} />
                                <TextField label="Caption (optional)" value={payload.caption ?? ''} onChange={setField('caption')} />
                            </>
                        )}
                        {blockType === 'link_card' && (
                            <>
                                <TextField label="Title" value={payload.title ?? ''} onChange={setField('title')} />
                                <TextField label="Description" value={payload.description ?? ''} onChange={setField('description')} multiline rows={3} />
                                <TextField label="URL" value={payload.url ?? ''} onChange={setField('url')} />
                            </>
                        )}
                        {blockType === 'divider' && (
                            <TextField label="Label (optional)" value={payload.label ?? ''} onChange={setField('label')} />
                        )}
                        {blockType === 'quiz' && (
                            <QuizEditor
                                quizId={quizId}
                                quizIdLocked={existing?.block_type === 'quiz'}
                                questions={quizQuestions}
                                correctIndexes={quizCorrectIndexes}
                                passingPercent={quizPassingPercent}
                                onQuizIdChange={setQuizId}
                                onQuestionChange={updateQuizQuestion}
                                onCorrectIndexChange={(questionIndex, optionIndex) => setQuizCorrectIndexes((current) => (
                                    current.map((value, index) => index === questionIndex ? optionIndex : value)
                                ))}
                                onAddQuestion={() => {
                                    setQuizQuestions((current) => [...current, emptyQuizQuestion()]);
                                    setQuizCorrectIndexes((current) => [...current, null]);
                                }}
                                onRemoveQuestion={removeQuizQuestion}
                                onPassingPercentChange={setQuizPassingPercent}
                            />
                        )}

                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="mb-1 block text-xs font-semibold uppercase tracking-widest text-slate-400">Sort order</label>
                                <input
                                    type="number"
                                    value={sortOrder}
                                    onChange={(e) => setSortOrder(Number(e.target.value) || 0)}
                                    className="w-full rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-sm text-slate-100"
                                />
                            </div>
                            {blockType === 'quiz' ? (
                                <p className="flex items-end pb-2 text-xs leading-5 text-violet-200">
                                    Quizzes publish atomically with private scoring.
                                </p>
                            ) : (
                                <label className="flex items-end gap-2 pb-2 text-sm text-slate-300">
                                    <input
                                        type="checkbox"
                                        checked={isPublished}
                                        onChange={(e) => setIsPublished(e.target.checked)}
                                        className="h-4 w-4"
                                    />
                                    Published
                                </label>
                            )}
                        </div>
                    </div>

                    {/* Preview */}
                    <div className="space-y-2">
                        <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Live preview</p>
                        <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
                            <ContentBlockRenderer override={previewOverride} isAdminView />
                        </div>
                    </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 bg-black/30 px-6 py-4">
                    <div>
                        {existing && (
                            <button
                                onClick={remove}
                                disabled={saving}
                                className="rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-300 hover:bg-red-500/20 disabled:opacity-50"
                            >
                                {restoresShippedQuiz ? 'Restore shipped quiz' : blockType === 'quiz' ? 'Remove quiz' : 'Delete block'}
                            </button>
                        )}
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={closeEditor}
                            disabled={saving}
                            className="rounded-lg border border-white/10 px-4 py-2 text-sm text-slate-300 hover:bg-white/5"
                        >
                            Cancel
                        </button>
                        {blockType !== 'quiz' && (
                            <button
                                onClick={() => save(false)}
                                disabled={saving}
                                className="rounded-lg border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-slate-100 hover:bg-white/10 disabled:opacity-50"
                            >
                                Save as draft
                            </button>
                        )}
                        <button
                            onClick={() => save(true)}
                            disabled={saving}
                            className="rounded-lg border border-zen-gold/60 bg-zen-gold px-4 py-2 text-sm font-bold text-zen-navy hover:bg-amber-400 disabled:opacity-50"
                        >
                            Publish
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const TextField: React.FC<{
    label: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    multiline?: boolean;
    rows?: number;
    mono?: boolean;
    disabled?: boolean;
}> = ({ label, value, onChange, multiline, rows = 4, mono, disabled }) => (
    <div>
        <label className="mb-1 block text-xs font-semibold uppercase tracking-widest text-slate-400">{label}</label>
        {multiline ? (
            <textarea
                value={value}
                onChange={onChange}
                disabled={disabled}
                rows={rows}
                className={`w-full rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-sm text-slate-100 disabled:cursor-not-allowed disabled:opacity-60 ${mono ? 'font-mono' : ''}`}
            />
        ) : (
            <input
                type="text"
                value={value}
                onChange={onChange}
                disabled={disabled}
                className="w-full rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-sm text-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
            />
        )}
    </div>
);

const QuizEditor: React.FC<{
    quizId: string;
    quizIdLocked: boolean;
    questions: PublicQuizQuestion[];
    correctIndexes: Array<number | null>;
    passingPercent: number;
    onQuizIdChange: (value: string) => void;
    onQuestionChange: (index: number, question: PublicQuizQuestion) => void;
    onCorrectIndexChange: (questionIndex: number, optionIndex: number | null) => void;
    onAddQuestion: () => void;
    onRemoveQuestion: (index: number) => void;
    onPassingPercentChange: (value: number) => void;
}> = ({
    quizId,
    quizIdLocked,
    questions,
    correctIndexes,
    passingPercent,
    onQuizIdChange,
    onQuestionChange,
    onCorrectIndexChange,
    onAddQuestion,
    onRemoveQuestion,
    onPassingPercentChange,
}) => (
    <div className="space-y-4">
        <div className="rounded-xl border border-violet-400/25 bg-violet-400/[0.06] p-3 text-xs leading-5 text-violet-100">
            Correct choices are sent only through the admin publish action. They are never written to learner-visible content or saved as a draft. Re-select every correct choice when editing a quiz.
        </div>
        <TextField
            label="Quiz ID"
            value={quizId}
            onChange={(event) => onQuizIdChange(event.target.value)}
            disabled={quizIdLocked}
        />
        {quizIdLocked && <p className="-mt-3 text-xs text-slate-500">To change this ID, remove the quiz safely and add a new one.</p>}
        <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-widest text-slate-400">Passing percent</label>
            <input
                type="number"
                min={1}
                max={100}
                value={passingPercent}
                onChange={(event) => onPassingPercentChange(Number(event.target.value) || 60)}
                className="w-full rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-sm text-slate-100"
            />
        </div>
        {questions.map((question, questionIndex) => (
            <div key={questionIndex} className="space-y-3 rounded-xl border border-white/10 bg-black/20 p-4">
                <div className="flex items-center justify-between gap-3">
                    <p className="text-xs font-bold uppercase tracking-widest text-slate-300">Question {questionIndex + 1}</p>
                    {questions.length > 1 && (
                        <button type="button" onClick={() => onRemoveQuestion(questionIndex)} className="text-xs text-red-300 hover:text-red-200">
                            Remove
                        </button>
                    )}
                </div>
                <textarea
                    rows={3}
                    value={question.question}
                    onChange={(event) => onQuestionChange(questionIndex, { ...question, question: event.target.value })}
                    placeholder="Question text"
                    className="w-full rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-sm text-slate-100"
                />
                <div className="space-y-2">
                    {question.options.map((option, optionIndex) => (
                        <div key={optionIndex} className="flex items-center gap-2">
                            <input
                                type="radio"
                                name={`quiz-correct-${questionIndex}`}
                                checked={correctIndexes[questionIndex] === optionIndex}
                                onChange={() => onCorrectIndexChange(questionIndex, optionIndex)}
                                aria-label={`Mark option ${optionIndex + 1} correct`}
                            />
                            <input
                                type="text"
                                value={option}
                                onChange={(event) => {
                                    const options = [...question.options];
                                    options[optionIndex] = event.target.value;
                                    onQuestionChange(questionIndex, { ...question, options });
                                }}
                                placeholder={`Option ${optionIndex + 1}`}
                                className="min-w-0 flex-1 rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-sm text-slate-100"
                            />
                            {question.options.length > 2 && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        const options = question.options.filter((_, index) => index !== optionIndex);
                                        onQuestionChange(questionIndex, { ...question, options });
                                        const selectedIndex = correctIndexes[questionIndex];
                                        if (selectedIndex === optionIndex) onCorrectIndexChange(questionIndex, null);
                                        else if (selectedIndex !== null && selectedIndex > optionIndex) {
                                            onCorrectIndexChange(questionIndex, selectedIndex - 1);
                                        }
                                    }}
                                    className="text-xs text-slate-500 hover:text-red-300"
                                >
                                    Remove
                                </button>
                            )}
                        </div>
                    ))}
                    {question.options.length < 8 && (
                        <button
                            type="button"
                            onClick={() => onQuestionChange(questionIndex, { ...question, options: [...question.options, ''] })}
                            className="text-xs font-semibold text-violet-300 hover:text-violet-200"
                        >
                            + Add option
                        </button>
                    )}
                </div>
                <textarea
                    rows={2}
                    value={question.explanation ?? ''}
                    onChange={(event) => onQuestionChange(questionIndex, { ...question, explanation: event.target.value })}
                    placeholder="Explanation (optional)"
                    className="w-full rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-sm text-slate-100"
                />
            </div>
        ))}
        {questions.length < 20 && (
            <button type="button" onClick={onAddQuestion} className="rounded-lg border border-violet-400/30 px-3 py-2 text-sm font-semibold text-violet-200 hover:bg-violet-400/10">
                + Add question
            </button>
        )}
    </div>
);

export default BlockEditorModal;
