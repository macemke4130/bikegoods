create table goods (
    id int primary key auto_increment not null,
    sold boolean default false,
    quantity int not null,
    price int not null,
    itemCondition int not null,
    title varchar(128) not null,
    brand varchar(64) not null,
    descriptionId int,
    photosId int,
    goodType int not null,
    deliveryTypes int not null
);

drop table goods;

create table itemConditions (
    id int primary key auto_increment not null,
    itemCondition varchar(64) not null
);

drop table itemConditions;

insert into itemConditions (itemCondition)
values ('New - In Packaging'),
('New - No Packaging'),
('Used - Like New'),
('Used - Very Good'),
('Used - Good'),
('Used - Acceptable and Functioning'),
('Used - For Parts or Not Functioning');

create table deliveryType (
    id int primary key auto_increment not null,
    deliveryType varchar(32)
);

insert into deliveryType (deliveryType)
values ('pickup'),
('shipping'),
('both');

create table goodsDescriptions (
    id int primary key auto_increment not null,
    descriptionText varchar(2000)
);

create table goodsPhotos (
    id int primary key auto_increment not null,
    goodId int,
    filename varchar(500)
);

create table goodsType (
    id int primary key auto_increment not null,
    type varchar(64) not null
);
drop table goodsType;

insert into goodsType (type)
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
('Handlebar'),
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

select * from goodsType;