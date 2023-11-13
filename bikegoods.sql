create database bikegoods;

create table users ( 
id int primary key auto_increment not null,
admin boolean default false,
emailAddress varchar(64) unique not null,
userPassword varchar(64) not null,
displayName varchar(64) unique not null,
firstName varchar(64),
lastName varchar(64)
);
drop table users;

select * from users;

create table paymentMethods (
id int primary key auto_increment not null,
userId int not null,
venmo varchar(64),
paypal varchar(64),
cashapp varchar(64),
zelle varchar(64),
applePay varchar(64),
googlePay varchar(64)
);
drop table paymentMethods;

insert into users (admin, emailAddress, userPassword, displayName, firstName, lastName)
values (true, 'lucasmace4130@gmail.com', 'password123', 'lucasMace', 'Lucas', 'Mace');

insert into paymentMethods(id, userId, venmo)
values (1, 1, 'macemke');

select * from users;