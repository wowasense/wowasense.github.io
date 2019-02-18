$(document).ready( function(){
  const
    $widget = $('.widget-checkout'),
    widget = document.querySelector('.widget-checkout'),
    $body = $('.body'),
    $parent = $widget.parent(),
    $firstItem = $('.gallery-item:first'),
    $sectionCheckout = $('.section-checkout');
  // "Перейти к завершению"
  (function addToCheckout() {
    var positionToShow = false;
    // скрыть при загрузке
    $widget.remove();
    // показать если релоад на той же позиции
    showToCheckout();
    // Если 1-й gallery item <= прокрутке показать иначе скрыть
    $(window).scroll(function(){
      showToCheckout();
    });
    // При изменении ширины окна
    $(window).resize(function() {
      adapt();
    });
    // Переход к заявке
    widget.onmouseup = function() {
      const sectionCoords = $sectionCheckout.offset().top;
      window.scrollTo(0, sectionCoords + 10);
    };


    function showToCheckout() {
      positionToShow = false;
      $widget.remove();
      if (!JSON.parse(localStorage.getItem('items'))) return;
      const coordsTop = $firstItem.get(0).getBoundingClientRect();
      const coordsBottom = $sectionCheckout.get(0).getBoundingClientRect();

      if (coordsTop.top <= 0 && coordsBottom.top > 700) {
        positionToShow = true;
        adapt();
      }
    }

    function adapt() {
      if (!positionToShow) return;

      function checkMobileWidth() {
        const scrollWidth = Math.max(
          document.body.scrollWidth, document.documentElement.scrollWidth,
          document.body.offsetWidth, document.documentElement.offsetWidth,
          document.body.clientWidth, document.documentElement.clientWidth
        );

        const mobileWidth = 576;

        if(scrollWidth <= mobileWidth) {
          return true;
        }

        return false;
      }

      if (checkMobileWidth()) {
        $widget.remove();
        $body.prepend($widget);
        $widget.addClass('widget-checkout_m');
        $widget.removeClass('widget-checkout');
      } else {
        $widget.removeClass('widget-checkout_m');
        $widget.addClass('widget-checkout');
        $widget.remove();
        $parent.prepend($widget);
      }
    }


  })();

  // Прокрутка в начало страницы
  (function scrollToTop(){
    var positionToShow = false;
    const upBtn = document.createElement('div');
    upBtn.className = 'up-btn';

    $(window).scroll(function(){
      show();
    });

    upBtn.onmouseup = function() {
      window.scrollTo(0, 0);
    };

    function show() {
      positionToShow = false;
      upBtn.remove();
      const coords = $sectionCheckout.get(0).getBoundingClientRect();
      if (coords.top <= 700) {
        positionToShow = true;
        $body.prepend(upBtn);
      }
    }

  })();

  // Выбор памятника
  (function chooseAnItems(){
    // Отображение заявки
    const
    // первый попавшийся?
      $blockForm = $('.form-checkout'),
      $blockChoice = $('.choice-block'),
      $blockItem = $('.checkout-item'),
      $blockClear = $('.choice-block__clear'),
      $blockComments = $('.choice-block__comments'),
      $blockText = $('.choice-block__text'),
      $blockContact = $('.checkout-contact'),
      galleryRow = document.querySelector('.gallery-row');

    // Делегирование и ловля итемов
    galleryRow.onmouseup = function(e) {
      const target = e.target;

      if ( (!target.classList.contains('gallery-item__btn')) || (target.classList.contains('gallery-item__btn_added')) ) return;

      target.classList.add('gallery-item__btn_added');
      target.textContent = 'Добавлено в заявку';

      //переход к родителю и сбор данных
      const
        parent = target.parentElement,
        id = parent.getAttribute('data-id'),
        material = parent.getAttribute('data-material'),
        price = parent.getAttribute('data-price');

      add(id, material, price);

    };


    function show() {
      let items = [];
      items = JSON.parse( localStorage.getItem('items') );
      if (items === null) {
        $blockItem.remove();
        $blockComments.remove();
        $blockContact.hide();
        $blockClear.remove();
        $blockText.html('Ваша заявка пуста. Выберите необходимое в ');
        const galleryLink = document.createElement('span');
        galleryLink.className = 'choice-block-link';
        galleryLink.textContent = 'галерее работ';
        $blockText.append(galleryLink);

        galleryLink.onmouseup = function() {
          const firstItem = $firstItem.offset().top;
          window.scrollTo(0, firstItem - 250);
        };
        return;
      }
      // стереть все и пройтись заново по всему хранилищу
      $('.checkout-item').remove();

      for (let i=0; i<items.length; i++) {
        const $currentItem = $blockItem.clone().insertBefore($blockText);
        // добавить инфу
        $currentItem.find('.item-desc__id span').text(items[i].id);
        $currentItem.find('.item-desc__material span').text(items[i].material);
        $currentItem.find('.item-desc__price span').text(items[i].price);
      }

      $blockClear.insertBefore($blockText);
      $blockChoice.append($blockComments);
      $blockText.html('Здесь указана <u>только</u> стоимость памятника. <br> Стоимость работ, доставки и установки памятника вы сможете узнать в ответном звонке.');
      $blockContact.show();

      $blockClear.on('mouseup', function() {
        console.log('ok');
        $('.checkout-item').remove();
        clearAll();
      });
    }

    // Отменить весь выбор
    function clearAll() {
      let items = [];
      const lengthStorage = JSON.parse(localStorage.getItem('items'));
      if (lengthStorage) {
        items = JSON.parse( localStorage.getItem('items') );

        for (let i=0; i<items.length; i++) {
          const id = items[i].id;
          const btn = document.querySelector(`.gallery-item:nth-child(${id}) .gallery-item__btn`);
          btn.classList.remove('gallery-item__btn_added');
          btn.textContent = 'Приложить к заявке';
        }
      }

      localStorage.removeItem('items');
      localStorage.removeItem('time');
      location.reload();
    }

    // таймер хранения итемов
    (function deleteOldItems() {
      const dateItems = Date.parse( localStorage.getItem('time') );
      const expireDate = new Date() - 1000*60*60*24*14;
      if (dateItems < expireDate) {
        localStorage.removeItem('items');
        localStorage.removeItem('time');
      }
    })();

    let items = [];
    // _added на кнопки
    const lengthStorage = JSON.parse(localStorage.getItem('items'));
    if (lengthStorage) {
      items = JSON.parse( localStorage.getItem('items') );

      for (let i=0; i<items.length; i++) {
        const id = items[i].id;
        const btn = document.querySelector(`.gallery-item:nth-child(${id}) .gallery-item__btn`);
        btn.classList.add('gallery-item__btn_added');
        btn.textContent = 'Добавлено в заявку';
      }
    }

    function add(id = '?', material = '?', price = '?') {
      //Добавление через localStorage JS
      const item = {
        id: id,
        material: material,
        price: price
      };

      if (!items.length && !lengthStorage) {
        items.push(item);
        localStorage.setItem('time', new Date());
        localStorage.setItem('items', JSON.stringify(items));
      } else {
        items.push(item);
        localStorage.setItem('items', JSON.stringify(items));
      }

      show();

    }

    show();

  })();

  

});
