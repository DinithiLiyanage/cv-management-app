import * as pdfjsLib from "pdfjs-dist";

// Set up the worker - using CDN to ensure version compatibility
if (typeof window !== "undefined") {
    pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;
}

export interface ParsedCVData {
    fullName?: string;
    email?: string;
    phone?: string;
    linkedInUrl?: string;
    githubUrl?: string;
    websiteUrl?: string;
    currentCompany?: string;
    skills?: string[];
}

/**
 * Extract text from a PDF file
 */
export async function extractTextFromPDF(file: File): Promise<string> {
    try {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

        let fullText = "";

        // Extract text from all pages
        for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
            const page = await pdf.getPage(pageNum);
            const textContent = await page.getTextContent();
            const pageText = textContent.items
                .map((item: any) => item.str)
                .join(" ");
            fullText += pageText + "\n";
        }
        return fullText;
    } catch (error) {
        console.error("Error extracting text from PDF:", error);
        throw new Error("Failed to extract text from PDF");
    }
}

/**
 * Parse CV text and extract structured data
 */
export function parseCVText(text: string): ParsedCVData {
    const parsed: ParsedCVData = {};

    // Email regex
    const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
    const emails = text.match(emailRegex);
    if (emails && emails.length > 0) {
        parsed.email = emails[0];
    }

    // Phone regex - matches various formats
    const phoneRegex = /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g;
    const phones = text.match(phoneRegex);
    if (phones && phones.length > 0) {
        parsed.phone = phones[0].replace(/\s+/g, " ").trim();
    }

    // LinkedIn URL
    const linkedInRegex = /(https?:\/\/)?(www\.)?linkedin\.com\/in\/[\w-]+/gi;
    const linkedInMatches = text.match(linkedInRegex);
    if (linkedInMatches && linkedInMatches.length > 0) {
        parsed.linkedInUrl = linkedInMatches[0].startsWith("http")
            ? linkedInMatches[0]
            : `https://${linkedInMatches[0]}`;
    }

    // GitHub URL (optional, if you want to extract it separately)
    const githubRegex = /(https?:\/\/)?(www\.)?github\.com\/[\w-]+/gi;
    const githubMatches = text.match(githubRegex);
    if (githubMatches && githubMatches.length > 0) {
        parsed.githubUrl = githubMatches[0].startsWith("http")
            ? githubMatches[0]
            : `https://${githubMatches[0]}`;
    }

    // Website/Portfolio URL (excluding LinkedIn and email domains)
    const urlRegex = /(https?:\/\/)?(www\.)?[\w-]+\.(com|net|org|io|dev|me|co)(\/[\w-]*)?/gi;
    const urls = text.match(urlRegex);
    if (urls && urls.length > 0) {
        const websiteUrl = urls.find(
            (url) =>
                !url.includes("linkedin") &&
                !url.includes("@") &&
                !url.includes("github.com") // Optionally exclude GitHub if you want to handle it separately
        );
        if (websiteUrl) {
            parsed.websiteUrl = websiteUrl.startsWith("http")
                ? websiteUrl
                : `https://${websiteUrl}`;
        }
    }

    // Extract name (usually at the beginning of the CV)
    // This is a simple heuristic - looks for capitalized words at the start
    const lines = text.split("\n").filter((line) => line.trim().length > 0);
    if (lines.length > 0) {
        const firstLine = lines[0].trim();
        // Check if first line looks like a name (2-4 capitalized words, no special chars)
        if (
            /^[A-Z][a-z]+(\s[A-Z][a-z]+){1,3}$/.test(firstLine) &&
            firstLine.length < 50
        ) {
            parsed.fullName = firstLine;
        }
    }

    // Try to extract current company
    // Look for patterns like "Current: Company Name" or "Present: Company Name"
    const currentCompanyRegex = /(current|present)[:|\s-]+([A-Z][\w\s&.,]+?)(?:\n|$|,|\s{2,})/gi;
    const companyMatch = text.match(currentCompanyRegex);
    if (companyMatch && companyMatch.length > 0) {
        const company = companyMatch[0]
            .replace(/(current|present)[:|\s-]+/gi, "")
            .trim();
        if (company.length < 50) {
            parsed.currentCompany = company;
        }
    }

const skillSectionMatch = text.match(/Skills([\s\S]*?)Interests/i);

let commonSkills: string[] = [];
if (skillSectionMatch) {
    commonSkills = skillSectionMatch[1]
        .split("•")
        .map(s => s.trim())
        .filter(Boolean);
}
// Helper function to escape special regex characters
const escapeRegex = (str: string) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const foundSkills = commonSkills.filter((skill) =>
    new RegExp(`\\b${escapeRegex(skill)}\\b`, "i").test(text)
);
    
    if (foundSkills.length > 0) {
        parsed.skills = foundSkills;
    }

    return parsed;
}

/**
 * Main function to parse CV file
 */
export async function parseCVFile(file: File): Promise<ParsedCVData> {
    try {
        // Extract text from PDF
        let text = await extractTextFromPDF(file);

        text = text
        .replace(/\s+/g, " ")
        .replace(/\u2022/g, "•")
        .replace(/\s\|\s/g, "|")
        .trim();

        console.log("Extracted CV Text:", text);

        // Parse the extracted text
        const parsedData = parseCVText(text);

        return parsedData;
    } catch (error) {
        console.error("Error parsing CV:", error);
        throw error;
    }
}
