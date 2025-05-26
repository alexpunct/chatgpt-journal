export interface Message {
	content: string;
	time: Date;
	role: string;
}

export type ChatModel = 'gpt-4.1-nano' | 'gpt-4.1';
