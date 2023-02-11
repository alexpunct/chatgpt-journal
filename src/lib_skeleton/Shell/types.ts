export interface Component {
	/** Provide a semantic component label. */
	label?: string;
	/** Provide HTML markup for a props description. */
	descProps?: string;
	/** Provide HTML markup for a slots description. */
	descSlots?: string;
	/** Provide HTML markup for a events description. */
	descEvents?: string;
	/** Provide a list of props that children can override. */
	overrideProps?: string[];
	/** Provide the raw component Sveld doc source. */
	sveld: any; // SveldJson; // FIXME: we need to resolve this type
}

export interface SveldJson {
	name?: string;
	type?: string;
	description?: string;
	value?: string;
	detail?: string;
	element?: string;
	tags?: {
		tag: string;
		value?: string;
	}[];
	[key: string]: unknown;
}

export interface ShellSettings {
	/** The feature name. */
	name: string;
	/** The feature description */
	description?: string;
	/** Show Table of contents */
	toc?: boolean;
	/** Component documentation, which utilizes Sveld. */
	components?: Component[];
	/** Component element that uses restProps */
	restProps?: string;
	/** Action parameter table source [prop, type, default, values, description] */
	parameters?: [string, string, string, string, string][];
	/** Tailwind Element classes table source [name, values, description] */
	classes?: [string, string, string][];
	/** Keyboard interaction table source [name, description]. */
	keyboard?: [string, string][];
}
