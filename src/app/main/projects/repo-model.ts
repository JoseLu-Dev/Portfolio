export interface Repo {
    name: string;
    html_url: string;
    homepage: string;

    stargazers_count: number;
    forks_count: number;

    topics: string[];

    presentationImage: string;
    imagesUrl: string[];

    es: RepoText;
    en: RepoText;
}

interface RepoText{
    description: string;
}