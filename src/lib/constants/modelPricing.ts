export interface ModelPricing {
    input: number;
    cached: number;
    output: number;
}

export const modelPricing: Record<string, ModelPricing> = {
    'gpt-4.1': {
        input: 2 / 1_000_000,
        cached: 0.5 / 1_000_000,
        output: 8 / 1_000_000
    },
    'gpt-4.1-mini': {
        input: 0.4 / 1_000_000,
        cached: 0.1 / 1_000_000,
        output: 1.6 / 1_000_000
    },
    'gpt-4.1-nano': {
        input: 0.1 / 1_000_000,
        cached: 0.025 / 1_000_000,
        output: 0.4 / 1_000_000
    }
};
