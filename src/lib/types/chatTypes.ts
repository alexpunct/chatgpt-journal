export interface Message {
	content: string;
	time: Date;
	role: string;
}

export type ChatModel = 'gpt-3.5-turbo' | 'gpt-4';
