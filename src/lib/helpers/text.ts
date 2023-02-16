export const exractLinesWithDate = (content: string) => {
	// Assuming the text is stored in a variable called input
	// Using regex to match different date formats
	const dateRegex =
		/(\d{4}[-/]\d{2}[-/]\d{2})|(\d{2}[-/]\d{2}[-/]\d{4})|(\d{1,2}\s[A-Z][a-z]{2}\s\d{4})|([A-Z][a-z]{2}\s\d{1,2},?\s\d{4})|([A-Z][a-z]+\s\d{1,2},?\s\d{4})/g;

	// Splitting the input by newline characters
	const lines = content.split(/\r?\n/);

	// Mapping each line to its date string if it contains one, or null otherwise
	const dates = lines.map((line, i) => {
		const match = line.match(dateRegex);
		return match ? { date: match[0], line, lineNo: i + 1 } : null;
	});

	// Filtering out the null values from the dates array
	const result = dates.filter((date) => date !== null);

	// Returning the result as an array of strings
	return result;
};
