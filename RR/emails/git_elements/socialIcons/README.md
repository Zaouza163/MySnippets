## Рекомендации по использованию:

* Общая ширина блока не должна привышать 300px для адаптивных макетов

## Возможные переменные:

* {number} leftRightPaddings - Отступы слева и справа каждой иконки
* {string} allign - Выравнивание блока относительно родителя
* {array} icons - Массив объектов содержащих свойства для каждой иконки
* {string} url - ссылка на иконку (свойство объекта иконки из массива иконок)
* {string} img - изображение иконки (свойство объекта иконки из массива иконок)
* {string} alt - изображение иконки (свойство объекта иконки из массива иконок)

## Пример использования

<@-element('socialIcons', {
  leftRightPaddings:8,
  align: 'center',
  icons: [
    {
      url: 'https://retailrocket.ru/',
      img: 'https://rrstatic.retailrocket.net/emails_default/vkS.png',
      alt: 'Вконтакте'
    },
    {
      url: 'https://retailrocket.ru/',
      img: 'https://rrstatic.retailrocket.net/emails_default/fbS.png',
      alt: 'Facebook'
    },
    {
      url: 'https://retailrocket.ru/',
      img: 'https://rrstatic.retailrocket.net/emails_default/inS.png',
      alt: 'Instagram'
    },
    {
      url: 'https://retailrocket.ru/',
      img: 'https://rrstatic.retailrocket.net/emails_default/okS.png',
      alt: 'ОК'
    },
    {
      url: 'https://retailrocket.ru/',
      img: 'https://rrstatic.retailrocket.net/emails_default/ytS.png',
      alt: 'YouTube'
    },
  ]
}); @>
