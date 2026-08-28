insert into public.productos(nombre,descripcion,precio,categoria_id,imagen,disponible,destacado) values
('Marraqueta crujiente','Corteza dorada y miga liviana, horneada durante toda la mañana.',2200,(select id from categorias where nombre='Panadería'),'/images/productos/marraqueta.jpg',true,true),
('Croissant de mantequilla','Hojaldrado a mano, dorado y delicadamente crujiente.',2490,(select id from categorias where nombre='Desayunos'),'/images/productos/croissant.jpg',true,true),
('Torta chocolate cielo','Bizcocho húmedo, ganache de chocolate y terminación artesanal.',26900,(select id from categorias where nombre='Tortas'),'/images/productos/torta-chocolate.jpg',true,true),
('Cheesecake frutos rojos','Cremoso, equilibrado y cubierto con frutos rojos.',3990,(select id from categorias where nombre='Pastelería'),'/images/productos/cheesecake.jpg',true,false),
('Arepa reina pepiada','Arepa recién hecha con pollo, palta y nuestra sazón de casa.',6490,(select id from categorias where nombre='Arepas'),'/images/productos/arepa.jpg',true,false),
('Desayuno del cielo','Café, jugo, croissant y tostadas para comenzar bien el día.',7990,(select id from categorias where nombre='Desayunos'),'/images/productos/desayuno.jpg',true,false),
('Torta personalizada','Diseñada para tu celebración, con sabores y terminaciones a elección.',0,(select id from categorias where nombre='Productos especiales'),'/images/productos/torta-personalizada.jpg',true,false),
('Empolvado artesanal','Suave bizcocho relleno con abundante manjar.',1890,(select id from categorias where nombre='Pastelería'),'/images/productos/empolvado.jpg',false,false);
