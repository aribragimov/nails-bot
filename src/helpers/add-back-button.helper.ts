export function addBackButton(path: string) {
  return [{ callback_data: path, text: 'назад' }];
}
