// Index file to re-export all curricula
import { pioneerCurriculum } from './pioneer/curriculumData';
import { homeschoolCurriculum } from './homeschool/curriculumData';
import { t3Curriculum } from './t3/curriculumData';
import { web3Curriculum } from './web3/curriculumData';
import { arenaCurriculum } from './arena/curriculumData';
import { hermesCurriculum } from './hermes/curriculumData';
import type { ProgramCurriculum } from '../types';
import { applyProgramStudioOverride, type ProgramStudioOverride } from '../curriculumStudioStore';

export const curriculumRegistry: Record<string, ProgramCurriculum> = {
    pioneer: pioneerCurriculum,
    homeschool: homeschoolCurriculum,
    t3: t3Curriculum,
    web3: web3Curriculum,
    arena: arenaCurriculum,
    hermes: hermesCurriculum,
};

export const getCurriculumByProgramId = (
    programId: string,
    publishedOverride?: ProgramStudioOverride | null,
): ProgramCurriculum | undefined => {
    const base = curriculumRegistry[programId];
    if (!base) return undefined;
    return publishedOverride ? applyProgramStudioOverride(base, publishedOverride) : base;
};

export {
    pioneerCurriculum,
    homeschoolCurriculum,
    t3Curriculum,
    web3Curriculum,
    arenaCurriculum,
    hermesCurriculum,
};
