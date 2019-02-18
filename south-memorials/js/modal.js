//валидация форм
jQuery.validator.addMethod("checkMask", function(value, element) {
     return /\+\d{1}\(\d{3}\)\d{3}-\d{4}/g.test(value);
});

jQuery.validator.addMethod("checkName", function(value, element) {
     return /^[a-zа-яё]+$/i.test(value);
});

$("#form-main").validate({
 rules: {
	 name: {
		 required: true,
		 minlength: 2,
		 maxlength: 18,
		 checkName: true
	 },
	 phone: {
		 checkMask: true
	 },

	 },
 messages: {
	 name: {
		 required: "Введите ваше имя",
		 minlength: jQuery.validator.format("Длина имени должна быть больше 1-го символа"),
		 maxlength: jQuery.validator.format("Длина имени должна быть меньше 19-ти символов"),
		 checkName: "Имя должно содержать только буквы"
	 },
	 phone: {
		 checkMask: "Введите ваш номер"
	 },
 },
	submitHandler: function() {
		alert("Валидация успешна!");
 }
});

$("#form-order").validate({
 rules: {
	 name: {
		 required: true,
		 minlength: 2,
		 maxlength: 18,
		 checkName: true
	 },
	 phone: {
		 checkMask: true
	 },

	 },
 messages: {
	 name: {
		 required: "Введите ваше имя",
		 minlength: jQuery.validator.format("Длина имени должна быть больше 1-го символа"),
		 maxlength: jQuery.validator.format("Длина имени должна быть меньше 19-ти символов"),
		 checkName: "Имя должно содержать только буквы"
	 },
	 phone: {
		 checkMask: "Введите ваш номер"
	 },
 }
});

$('.callback-form__phone').mask("+7(999)999-9999", {autoclear: false});

$(".modal").each( function(){
	$(this).wrap('<div class="overlay"></div>')
});

$(".open-modal").on('click', function(e){
	// Отправка и вывод формы
	e.preventDefault();
	e.stopImmediatePropagation;
	console.log('1');
	const
		nameValue = $('.callback-form__name').val(),
		phoneValue = $('.callback-form__phone').val();

	if ( !nameValue || !phoneValue) return;
	console.log('1');

	const
		phoneInvalid = $('.callback-form__phone').attr('aria-invalid'),
		nameInvalid = $('.callback-form__name').attr('aria-invalid');

	if ((phoneInvalid === "true") || (nameInvalid === "true")) return;

	var $this = $(this),
			modal = $($this).data("modal");

	$(modal).parents(".overlay").addClass("open");
	setTimeout( function(){
		$(modal).addClass("open");
	}, 350);

	$(document).on('click', function(e){
		var target = $(e.target);

		if ($(target).hasClass("overlay")){
			$(target).find(".modal").each( function(){
				$(this).removeClass("open");
			});
			setTimeout( function(){
				$(target).removeClass("open");
			}, 350);
		}

	});

});

$(".close-modal").on('click', function(e){
	e.preventDefault();
	e.stopImmediatePropagation;

	var $this = $(this),
			modal = $($this).data("modal");

	$(modal).removeClass("open");
	setTimeout( function(){
		$(modal).parents(".overlay").removeClass("open");
	}, 350);

});
