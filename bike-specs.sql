create table bicycleSpecs (
	id int primary key auto_increment,
    goodId int,
    metric boolean default true,
    frameSize double,
    suspensionTypeId tinyInt,
    topTubeLength double,
    seatTubeLength double,
    bbShellId tinyInt,
    rearDropoutId tinyInt,
    frontDropoutId tinyInt,
    brakeStyleId tinyInt,
    seatPostDiameter double,
    wheelSizeId tinyInt
);

drop table bicycleSpecs;

create table suspensionTypes (
	id tinyInt primary key auto_increment,
    suspensionType varchar(32)
);

create table bbShells (
	id tinyInt primary key auto_increment,
    bbShell varchar(32)
);

create table rearDropouts (
	id tinyInt primary key auto_increment,
    rearDropout varchar(32)
);

create table frontDropouts (
	id tinyInt primary key auto_increment,
    frontDropout varchar(32)
);

create table brakeStyles (
	id tinyInt primary key auto_increment,
    brakeStyle varchar(32)
);

create table wheelSizes (
	id tinyInt primary key auto_increment,
    wheelSize varchar(32)
);

insert into bbShells (bbShell) values 
("English"),
("Italian"),
("386 EVO"),
("Mid"),
("BB86/92"),
("Press Fit 30"),
("BB30"),
("T47"),
("DUB"),
("BBright")
;

insert into wheelSizes (wheelSize) values 
("700c / 29in"),
("650b / 27.5in"),
("26in"),
("24in"),
("20in"),
("18in"),
("16in"),
("14in"),
("12in"),
("36in")
;

insert into brakeStyles (brakeStyle) values 
("Road Caliper"),
("Cantilever"),
("Linear Pull / V-Brake"),
("Disc - Flat Mount"),
("Disc - Post Mount"),
("Disc - ISO Mount"),
("Roller / Drum Brake"),
("U-Brake")
;

insert into frontDropouts (frontDropout) values 
("QR / Solid Axle - 100mm"),
("Thru Axle - 12mm x 100mm"),
("Thru Axle - 15mm x 100mm"),
("Thru Axle - 15mm x 110mm"),
("Thru Axle - 15mm x 150mm"),
("Lefty")
; 

insert into rearDropouts (rearDropout) values 
("QR / Solid Axle - 110mm"),
("QR / Solid Axle - 120mm"),
("QR / Solid Axle - 130mm"),
("QR / Solid Axle - 135mm"),
("Thru Axle - 12mm x 142mm"),
("Thru Axle - 12mm x 150mm"),
("Thru Axle - 12mm x 157mm"),
("Thru Axle - 12mm x 197mm")
;

insert into suspensionTypes (suspensionType) values 
("Fully Rigid"),
("Hardtail"),
("Full Suspension")
;