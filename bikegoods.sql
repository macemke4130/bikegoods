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

insert into users (admin, emailAddress, userPassword, displayName, firstName, lastName)
values (true, 'lucasmace4130@gmail.com', 'password123', 'lucasMace', 'Lucas', 'Mace');

select * from users;