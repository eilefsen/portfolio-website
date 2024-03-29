export interface ThoughtNoID {
	heading: string;
	body: string;
	dateTimeCreated: string;
}
export interface Thought extends ThoughtNoID {
	id: number;
}
