export interface Article {
  _id: number;
  id: number;
  image: string;
  title: string;
  link: string;
  date: Date;
  content: string;
  status: string;
  writer: string
  editor: string
  company: string;
}

export interface ArticlePayload {
  company: string;
  title: string;
  link: string;
  date: Date;
  content: string;
  image: string
}