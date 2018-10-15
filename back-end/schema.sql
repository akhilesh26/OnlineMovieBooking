create database Udaan_Cinema;
use Udaan_Cinema;

create table tickets ( id int AUTO_INCREMENT primary key, screen_name varchar(250), seat_name varchar(250), is_reserved BOOLEAN, is_aisle BOOLEAN);