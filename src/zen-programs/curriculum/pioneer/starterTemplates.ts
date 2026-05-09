export interface PioneerStarterTemplateFile {
    path: string;
    language: 'html' | 'markdown' | 'python' | 'text';
    content: string;
}

export interface PioneerStarterTemplate {
    id: string;
    title: string;
    recommendedModule: string;
    description: string;
    files: PioneerStarterTemplateFile[];
    safetyNotes: string[];
}

const minimalGradioApp = `import os
import gradio as gr
from huggingface_hub import InferenceClient

HF_TOKEN = os.getenv("HF_TOKEN")

def generate_response(prompt: str) -> str:
    if not HF_TOKEN:
        return "Missing HF_TOKEN. Add it in your Hugging Face Space settings under Secrets."

    client = InferenceClient(token=HF_TOKEN)

    try:
        response = client.chat_completion(
            model="HuggingFaceH4/zephyr-7b-beta",
            messages=[
                {"role": "system", "content": "You are a helpful AI assistant for a student-built demo."},
                {"role": "user", "content": prompt},
            ],
            max_tokens=250,
        )
        return response.choices[0].message.content
    except Exception as error:
        return f"Something went wrong: {error}"

demo = gr.Interface(
    fn=generate_response,
    inputs=gr.Textbox(label="Ask your AI app something", lines=4),
    outputs=gr.Textbox(label="AI Response"),
    title="My First AI Space",
    description="A safe starter Hugging Face Space built during the ZEN AI Pioneer Program."
)

if __name__ == "__main__":
    demo.launch()
`;

const minimalGradioReadme = [
    '# My First AI Space',
    '',
    'A safe starter Hugging Face Space built during the ZEN AI Pioneer Program.',
    '',
    '## What It Does',
    '',
    'This app accepts a text prompt and returns a short AI-generated response using the Hugging Face Inference API.',
    '',
    '## Required Secret',
    '',
    'Set `HF_TOKEN` in Hugging Face Space settings under Secrets. Do not paste the token into `app.py`, this README, screenshots, chat messages, public repos, or browser storage.',
    '',
    '## Files',
    '',
    '- `app.py`: Gradio interface and model call',
    '- `requirements.txt`: Python packages for the Space',
    '- `README.md`: project description and safety notes',
    '',
    '## Responsible AI Note',
    '',
    'This is a student-built demo. Outputs may be incorrect, biased, incomplete, or unsafe for important decisions. Users should verify important information with trusted sources.',
    '',
    '## Portfolio Evidence',
    '',
    'After launch, add the public Space URL, one screenshot, a short demo note, and a reflection on what you improved.',
].join('\n');

const minimalStreamlitApp = `import os
import streamlit as st
from huggingface_hub import InferenceClient

HF_TOKEN = os.getenv("HF_TOKEN")

st.set_page_config(page_title="My First AI Space", page_icon="AI")
st.title("My First AI Space")
st.write("A safe starter Hugging Face Space built during the ZEN AI Pioneer Program.")

prompt = st.text_area("Ask your AI app something", height=140)

def generate_response(user_prompt: str) -> str:
    if not HF_TOKEN:
        return "Missing HF_TOKEN. Add it in your Hugging Face Space settings under Secrets."

    client = InferenceClient(token=HF_TOKEN)

    try:
        response = client.chat_completion(
            model="HuggingFaceH4/zephyr-7b-beta",
            messages=[
                {"role": "system", "content": "You are a helpful AI assistant for a student-built demo."},
                {"role": "user", "content": user_prompt},
            ],
            max_tokens=250,
        )
        return response.choices[0].message.content
    except Exception as error:
        return f"Something went wrong: {error}"

if st.button("Generate response", type="primary"):
    if not prompt.strip():
        st.warning("Enter a prompt first.")
    else:
        st.write(generate_response(prompt))
`;

const minimalStreamlitReadme = [
    '# My First AI Streamlit Space',
    '',
    'A safe starter Streamlit app for the ZEN AI Pioneer Program.',
    '',
    '## Required Secret',
    '',
    'Set `HF_TOKEN` in Hugging Face Space settings under Secrets. Do not paste token values into source code, README files, screenshots, chat messages, or browser storage.',
    '',
    '## Responsible AI Note',
    '',
    'This app is a learning demo. It can make mistakes and should not be used for medical, legal, financial, safety, or other high-stakes decisions.',
    '',
    '## Portfolio Evidence',
    '',
    'Submit the public Space URL, a screenshot or demo note, a project description, and one improvement you made after testing.',
].join('\n');

const runtimeByokApp = `import gradio as gr
from huggingface_hub import InferenceClient

def generate_response(runtime_token: str, prompt: str) -> str:
    if not runtime_token.strip():
        return "Missing runtime token. This BYOK demo is for testing only. Prefer HF_TOKEN as a Space Secret for shared demos."

    if not prompt.strip():
        return "Enter a prompt first."

    client = InferenceClient(token=runtime_token.strip())

    try:
        response = client.chat_completion(
            model="HuggingFaceH4/zephyr-7b-beta",
            messages=[
                {"role": "system", "content": "You are a helpful AI assistant for a student-built testing demo."},
                {"role": "user", "content": prompt},
            ],
            max_tokens=250,
        )
        return response.choices[0].message.content
    except Exception as error:
        return f"Something went wrong: {error}"

with gr.Blocks(title="Runtime BYOK Testing Demo") as demo:
    gr.Markdown(
        "## Runtime BYOK Testing Demo\\n"
        "Testing-only pattern. Do not store keys in code, README files, screenshots, chat, or localStorage."
    )
    token = gr.Textbox(label="Runtime Hugging Face token", type="password")
    prompt = gr.Textbox(label="Prompt", lines=4)
    output = gr.Textbox(label="AI Response")
    gr.Button("Generate response").click(
        fn=generate_response,
        inputs=[token, prompt],
        outputs=output,
    )

if __name__ == "__main__":
    demo.launch()
`;

const runtimeByokReadme = [
    '# Runtime BYOK Testing Demo',
    '',
    'This template lets a student test a Hugging Face token at runtime through a password input.',
    '',
    '## Safety Boundary',
    '',
    'Runtime BYOK is for testing only. For a shared public demo, use a Hugging Face Space Secret named `HF_TOKEN` instead.',
    '',
    'Do not store keys in source code, README files, screenshots, chat messages, public repos, localStorage, or browser storage.',
    '',
    '## Portfolio Note',
    '',
    'If you use this for testing, explain in your reflection that the public project should move secrets into Space Secrets before sharing widely.',
].join('\n');

const portfolioLinkFormat = [
    'Project title: <your app name>',
    'Live Space URL: https://huggingface.co/spaces/<username>/<space-name>',
    'One-sentence purpose: <what your app helps someone do>',
    'Audience: <who the app is for>',
    'Responsible AI note: <one limitation, risk, or safe-use boundary>',
].join('\n');

const portfolioIframeFallback = `<iframe
  src="https://huggingface.co/spaces/<username>/<space-name>"
  title="<your app name>"
  width="100%"
  height="720"
  style="border: 1px solid #d0d7de; border-radius: 12px;"
></iframe>

<p>
  If the embed does not load, open the demo directly:
  <a href="https://huggingface.co/spaces/<username>/<space-name>">Launch the Hugging Face Space</a>
</p>
`;

const projectDescriptionTemplate = [
    '# Project Description',
    '',
    'My app is called <project name>.',
    '',
    'It helps <target user> with <task or problem>.',
    '',
    'The app uses <Gradio or Streamlit> and a Hugging Face model to <main capability>.',
    '',
    'The most important safety boundary is <limitation or responsible AI note>.',
    '',
    'The live demo is available at: https://huggingface.co/spaces/<username>/<space-name>',
].join('\n');

const reflectionPrompt = [
    '# Reflection Prompt',
    '',
    '1. What did you build?',
    '2. Who is it for?',
    '3. What changed after testing or peer feedback?',
    '4. How did you protect API keys or tokens?',
    '5. What can the app still get wrong?',
    '6. What would you improve next?',
].join('\n');

export const pioneerStarterTemplates: PioneerStarterTemplate[] = [
    {
        id: 'minimal-gradio-hugging-face-space',
        title: 'Minimal Gradio Hugging Face Space',
        recommendedModule: 'Module 3',
        description: 'The recommended first template for students building their week 4 or week 5 launch project.',
        files: [
            {
                path: 'app.py',
                language: 'python',
                content: minimalGradioApp,
            },
            {
                path: 'requirements.txt',
                language: 'text',
                content: 'gradio>=4.44.0\nhuggingface_hub>=0.24.0\n',
            },
            {
                path: 'README.md',
                language: 'markdown',
                content: minimalGradioReadme,
            },
        ],
        safetyNotes: [
            'Use HF_TOKEN only as a Hugging Face Space Secret.',
            'Do not paste real token values into code, README files, screenshots, chat messages, public repos, or localStorage.',
            'Keep the missing-secret message in the app so students can debug safely.',
        ],
    },
    {
        id: 'minimal-streamlit-hugging-face-space',
        title: 'Minimal Streamlit Hugging Face Space',
        recommendedModule: 'Module 3',
        description: 'A lightweight alternative for students or facilitators who prefer Streamlit.',
        files: [
            {
                path: 'app.py',
                language: 'python',
                content: minimalStreamlitApp,
            },
            {
                path: 'requirements.txt',
                language: 'text',
                content: 'streamlit>=1.37.0\nhuggingface_hub>=0.24.0\n',
            },
            {
                path: 'README.md',
                language: 'markdown',
                content: minimalStreamlitReadme,
            },
        ],
        safetyNotes: [
            'Use HF_TOKEN only as a Hugging Face Space Secret.',
            'Never store API keys in browser storage or commit them to public files.',
            'Keep the first version small enough to test and debug before adding advanced features.',
        ],
    },
    {
        id: 'runtime-byok-demo',
        title: 'Runtime BYOK Demo',
        recommendedModule: 'Module 3',
        description: 'A testing-only pattern where a learner supplies a token at runtime without storing it in app code.',
        files: [
            {
                path: 'app.py',
                language: 'python',
                content: runtimeByokApp,
            },
            {
                path: 'requirements.txt',
                language: 'text',
                content: 'gradio>=4.44.0\nhuggingface_hub>=0.24.0\n',
            },
            {
                path: 'README.md',
                language: 'markdown',
                content: runtimeByokReadme,
            },
        ],
        safetyNotes: [
            'Runtime BYOK demos are for testing only.',
            'Do not store keys in localStorage, source code, README files, screenshots, chat messages, or public repos.',
            'For shared demos, prefer a Hugging Face Space Secret named HF_TOKEN.',
        ],
    },
    {
        id: 'portfolio-embed-snippet',
        title: 'Portfolio Embed Snippet',
        recommendedModule: 'Module 4',
        description: 'Copy-ready portfolio text that links the public Space URL to showcase and credential evidence.',
        files: [
            {
                path: 'plain-link-format.txt',
                language: 'text',
                content: portfolioLinkFormat,
            },
            {
                path: 'iframe-fallback.html',
                language: 'html',
                content: portfolioIframeFallback,
            },
            {
                path: 'project-description.md',
                language: 'markdown',
                content: projectDescriptionTemplate,
            },
            {
                path: 'reflection-prompt.md',
                language: 'markdown',
                content: reflectionPrompt,
            },
        ],
        safetyNotes: [
            'Use the public Space URL, not private account or token details.',
            'Do not paste API keys into portfolio pages or screenshots.',
            'Include one responsible AI limitation so reviewers understand the demo boundary.',
        ],
    },
];
