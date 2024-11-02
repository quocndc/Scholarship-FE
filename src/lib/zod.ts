import { zu } from 'zod_utilz';

export const customErrorMap = zu.makeErrorMap({
  required: 'Vui lòng nhập giá trị',
  invalid_type: ({ data }) => `${data} is an invalid type`,
  too_big: ({ maximum }) => `Nhập nhiều nhất ${maximum} ký tự`,
  too_small: ({ minimum }) => `Nhập ít nhất ${minimum} ký tự`,
  invalid_enum_value: ({ options }) => `Giá trị hợp lệ: ${options?.join(' | ')} `,
});
