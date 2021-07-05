export interface Repo {
    name: string;
    html_url: string;
    description: string;
    homepage: string;

    stargazers_url: string;
    stargazers_count: number;
    forks_url: string;
    forks_count: number;

    topics: string[];

    presentationImage: string
    imagesUrl: string[];
}