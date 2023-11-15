create table goods (
    id int primary key auto_increment not null,
    dateListed timestamp default now(),
    userId int not null,
    sold boolean default false,
    quantity int not null,
    price int not null,
    itemCondition int not null,
    title varchar(128) not null,
    brand int,
    descriptionId int,
    photosId int,
    categoryId int not null,
    subcategoryId int,
    deliveryId int not null
);

drop table goods;

select * from goods inner join brands on goods.brand = brands.id join goodTypes on goods.goodType = goodTypes.id join itemConditions on goods.itemCondition = itemConditions.id join goodDescriptions on goods.descriptionId = goodDescriptions.id join deliveryTypes on goods.deliveryId = deliveryTypes.id where goods.id = 1;

create table categories (
	id int primary key auto_increment not null,
    category varchar(32)
);

drop table categories;

insert into categories (category)
values ("Bicycles"),
("Parts and Accessories"),
("Apparel"),
("Art and Novelties"),
("Car Racks and Storage"),
("Tools");

create table subcategories (
	id int primary key auto_increment not null,
    categoryId int not null,
    subcategory varchar(32)
);

drop table subcategories;

insert into subcategories (categoryId, subcategory)
values (1, "Road Bike"),
(1, "Mountain Bike"),
(1, "Commuter / Hybrid Bike"),
(1, "Track Bike"),
(1, "Touring Bike"),
(1, "Folding Bike"),
(1, "Cargo Bike"),
(1, "Gravel / Adventure Bike"),
(2, "Rear Derailleur"),
(2, "Front Derailleur"),
(2, "Handlebar"),
(2, "Stem"),
(2, "Bar Tabe / Grips"),
(2, "Fenders"),
(2, "Cargo Rack"),
(2, "Pedals"),
(2, "Crankset"),
(2, "Chainring"),
(2, "Chain"),
(2, "Cassette"),
(2, "Freewheel"),
(2, "Tire"),
(2, "Wheel"),
(2, "Tube"),
(2, "Cable / Housing / Hose"),
(2, "Brake Pad"),
(2, "Tubeless Sealant"),
(2, "Rim Tape"),
(2, "Rim"),
(2, "Spokes / Nipples"),
(2, "Front Hub"),
(2, "Rear Hub"),
(2, "Brake / Brakeset"),
(2, "Rotor"),
(2, "Small Part"),
(3, "Jersey"),
(3, "Bibs"),
(3, "Shoes"),
(3, "Socks"),
(3, "Helmet"),
(3, "Padding"),
(3, "Sunglasses"),
(3, "Vest"),
(3, "Jacket"),
(4, "Wall Art"),
(4, "Koozie"),
(4, "Stickers / Patches"),
(4, "Novelties"),
(5, "Trunk Rack"),
(5, "Hitch Rack"),
(5, "Roof Rack"),
(5, "Auto Roof Cargo Storage"),
(5, "Indoor Storage"),
(6, "General"),
(6, "Frame"),
(6, "Repair Stand"),
(6, "Wheel"),
(6, "Drivetrain")
;

select * from subcategories;

create table itemConditions (
    id int primary key auto_increment not null,
    itemConditionName varchar(64) not null
);

drop table itemConditions;

insert into itemConditions (itemConditionName)
values ('New - In Packaging'),
('New - No Packaging'),
('Used - Like New'),
('Used - Very Good'),
('Used - Good'),
('Used - Acceptable and Functioning'),
('Used - For Parts or Not Functioning');

create table deliveryTypes (
    id int primary key auto_increment not null,
    deliveryType varchar(32)
);

drop table deliveryTypes;

insert into deliveryTypes (deliveryType)
values ('Pickup Only'),
('Shipping Only'),
('Pickup or Shipping');

select * from deliveryTypes;

create table goodDescriptions (
    id int primary key auto_increment not null,
    descriptionText varchar(2000)
);
drop table goodDescriptions;
select * from goodDescriptions;

create table goodsPhotos (
    id int primary key auto_increment not null,
    goodId int,
    filename varchar(500)
);

create table goodTypes (
    id int primary key auto_increment not null,
    type varchar(64) not null
);
drop table goodTypes;

insert into goodTypes (type)
values ('Rear Derailleur'),
('Front Derailleur'),
('Brake'),
('Brake Lever'),
('Hub'),
('Shifter'),
('Shifter / Brake Lever Integrated'),
('Adapter'),
('Bottom Bracket'),
('Crank'),
('Chainring'),
('Hardware'),
('Spoke'),
('Stem'),
('Saddle'),
('Handlebars'),
('Grip'),
('Bar Tape'),
('Fender'),
('Front Rack'),
('Rear Rack'),
('Tube'),
('Bag'),
('Fork'),
('Skewer / Thru Bolt'),
('Small Part'),
('Seatpost'),
('Pedals'),
('Brake Pad'),
('Cable / Housing / Hose'),
('Chain'),
('Cassette'),
('Freewheel'),
('Fixed Cog / Lockring'),
('Tire');

select * from goodTypes;