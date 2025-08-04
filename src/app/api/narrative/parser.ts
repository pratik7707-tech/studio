
import mammoth from 'mammoth';

export async function parseDocx(fileBuffer: Buffer): Promise<{ Context: string; Challenges: string; Opportunities: string; }> {
    const { value: text } = await mammoth.extractRawText({ buffer: fileBuffer });
    
    const sections: { [key: string]: string[] } = {
        Context: [],
        Challenges: [],
        Opportunities: [],
    };

    const lines = text.split('\n');
    let currentSection: keyof typeof sections | null = null;
    
    const headings: (keyof typeof sections)[] = ['Context', 'Challenges', 'Opportunities'];

    for (const line of lines) {
        const trimmedLine = line.trim();
        if (!trimmedLine) continue;

        let headingFound: keyof typeof sections | null = null;
        let contentAfterHeading = '';
        
        for (const heading of headings) {
            if (trimmedLine.toLowerCase().startsWith(heading.toLowerCase())) {
                headingFound = heading;
                const headingIndex = trimmedLine.toLowerCase().indexOf(heading.toLowerCase());
                contentAfterHeading = trimmedLine.substring(headingIndex + heading.length).trim();
                break;
            }
        }
        
        if (headingFound) {
            currentSection = headingFound;
            if (contentAfterHeading.startsWith(':')) {
                contentAfterHeading = contentAfterHeading.substring(1).trim();
            }
            if (contentAfterHeading) {
                sections[currentSection].push(contentAfterHeading);
            }
        } else if (currentSection) {
            sections[currentSection].push(trimmedLine);
        }
    }

    return {
        Context: sections.Context.join('\n').trim(),
        Challenges: sections.Challenges.join('\n').trim(),
        Opportunities: sections.Opportunities.join('\n').trim(),
    };
}
