create table products (
	id uuid primary key default uuid_generate_v4(),
	title text not null,
	description text,
	price integer
)

create extension if not exists "uuid-ossp"

create table stocks (
	count integer,
	product_id uuid primary key,
	foreign key ("product_id") references "products" ("id")
)

insert into products (title, description, price) values
('Product1', 'Short Product Description1', 2),
('Product2', 'Short Product Description2', 4),
('Product3', 'Short Product Description3', 6),
('Product4', 'Short Product Description4', 8),
('Product5', 'Short Product Description5', 10),
('Product6', 'Short Product Description6', 12),
('Product7', 'Short Product Description7', 14),
('Product8', 'Short Product Description8', 16)

insert into stocks (count, product_id) values
(2, 'f6f8fc53-91ad-4183-a6fb-e9e1ec58154f'),
(4, 'fc7b8a60-af8e-4cca-9b7b-b8c34fde577e'),
(6, '89cbe435-2620-4800-8a98-daff796cb761'),
(8, 'a051db93-61ad-4c9a-9712-faad8721659b'),
(10, 'fc5d3609-dfb2-4ebc-ae51-3f69c21515a4'),
(12, 'f7dea17d-ac6d-471b-8ae0-0c7c722d37f6'),
(14, 'c9af6ef5-e929-4c50-82a1-dd743464afed'),
(16, '07f45cee-0b2c-4427-a259-5ad5cbee55f4')
