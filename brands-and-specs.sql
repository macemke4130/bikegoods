create table brands (
    id int primary key auto_increment not null,
    brandName varchar(64) not null
);

drop table brands;

insert into brands (brandName)
values ('shimano'),
('sram'),
('campagnolo'),
('wolf tooth'),
('otso'),
('jagwire'),
('specialized'),
('trek'),
('bontrager'),
('surly'),
('salsa'),
('all city'),
('velo orange'),
('park tool'),
("pedro's"),
('esi'),
('panaracer'),
('microshift');

select * from brands;
