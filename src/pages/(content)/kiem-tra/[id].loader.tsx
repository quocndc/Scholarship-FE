import axios from '@lib/axios';
import { IResponse, Quiz } from '@lib/types';
import queryString from 'query-string';

export function getQuizDetails(id: string) {
  const qs = queryString.stringify({
    populate: 'question',
    fields: ['question.question', 'question.option', 'question.answer'],
  });
  return axios.get<IResponse<Quiz>>(`/quiz/${id}?${qs}`).then((res) => res.data.data);
}
