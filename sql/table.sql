create table user(
id int auto_increment primary key not null,
username varchar(255) unique,
password varchar(255),
createdAt timestamp default current_timestamp,
updatedAt timestamp default current_timestamp on update current_timestamp
);

create table task(
id int auto_increment primary key not null,
items varchar(255),
user_id int,
createdAt timestamp default current_timestamp,
updatedAt timestamp default current_timestamp on update current_timestamp,
foreign key(user_id) references user(id)
);