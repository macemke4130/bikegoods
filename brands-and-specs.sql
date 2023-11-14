create table brands (
    id int primary key auto_increment not null,
    brandName varchar(64) not null
);

insert into brands (brandName)
values ('Shimano'),
('Sram'),
('Campagnolo'),
('Wolf Tooth'),
('Otso'),
('Jagwire'),
('Specialized'),
('Trek'),
('Bontrager'),
('Surly'),
('Salsa'),
('All City'),
('Velo Orange'),
('Park Tool'),
("Pedro's"),
('ESI'),
('Panaracer'),
('Microshift');

select * from brands;
