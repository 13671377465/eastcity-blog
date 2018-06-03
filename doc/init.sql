create DATABASE ecblog;

use ecblog;

create table users (
    id varchar(50) not null,
    gender bool not null,
    name varchar(20) not null,
    birth varchar(20) not null,
    createdAt bigint not null,
    updatedAt bigint not null,
    version bigint not null,
    primary key (id)
)engine=innodb;