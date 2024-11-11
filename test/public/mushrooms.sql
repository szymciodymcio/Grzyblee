-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Czas generowania: 11 Lis 2024, 18:56
-- Wersja serwera: 10.4.21-MariaDB
-- Wersja PHP: 8.0.11

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Baza danych: `mushrooms`
--

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `grzyby`
--

CREATE TABLE `grzyby` (
  `id_grzyba` int(11) NOT NULL,
  `nazwa` varchar(40) NOT NULL,
  `img` varchar(70) NOT NULL,
  `poziom_trudnosci` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Zrzut danych tabeli `grzyby`
--

INSERT INTO `grzyby` (`id_grzyba`, `nazwa`, `img`, `poziom_trudnosci`) VALUES
(1, 'borowik', 'borowik.jpg', 25),
(2, 'podgrzybek', 'podgrzybek.jpg', 25),
(3, 'rydz', 'rydz.jpg', 25),
(4, 'kania', 'kania.jpg', 25),
(5, 'zlotoborowik', 'zlotoborowik.jpg', 25),
(6, 'golabek', 'golabek.jpg', 25),
(7, 'opienka', 'opienka.jpeg', 25),
(8, 'boczniak', 'boczniak.jpg', 25),
(9, 'kurka', 'kurka.jpg', 25),
(10, 'muchomor czerwony', 'muchomorczerwony.jpg', 25),
(11, 'maslak', 'maslak.jfif', 25),
(12, 'kozak', 'kozak.jpeg', 25),
(13, 'goryczak', 'goryczak.jpg', 25),
(14, 'muchomor sromotnikowy', 'muchomorsromotnikowy.jpeg', 25),
(15, 'purchawka', 'purchawka.jpg', 25),
(16, 'gaska siwa', 'gaska_siwa.jpg', 50),
(17, 'plachetka', 'plachetka.jpg', 50),
(18, 'mleczaj', 'mleczaj.jpg', 50),
(19, 'zaslonak', 'zaslonak.jpg', 50),
(20, 'muchomor cytrynowy', 'muchomor_cytrynowy.jpg', 50),
(21, 'czubajka', 'czubajka.jpg', 50),
(22, 'krowiak', 'krowiak.jpg', 50),
(23, 'madziak', 'madziak.jpg', 50),
(24, 'soplówka', 'soplowka.jfif', 50),
(25, 'siedzuń', 'siedzun.jpg', 50),
(26, 'czernidlak', 'czernidlak.jpeg', 50),
(27, 'kustrzebka', 'kustrzebka.jpg', 50),
(28, 'koralowka', 'koralowka.jpg', 50),
(29, 'gasowka', 'gasowka.jpg', 50),
(30, 'trufle', 'trufle.jpg', 50),
(31, 'szyszkowiec', 'szyszkowiec.jpg', 100),
(32, 'dzwonkowka', 'dzwonkowka.jfif', 100),
(33, 'twardzioszek', 'twardzioszek.jfif', 100),
(34, 'zagwica', 'zagwica.jfif', 100),
(35, 'lisowka', 'lisowka.jpg', 100),
(36, 'luskwiak', 'luskwiak.jpg', 100),
(37, 'wlosnianka', 'wlosnianka.jpg', 100),
(38, 'gwiazdosz', 'gwiazdosz.jpg', 100),
(39, 'szyszkolubka', 'szyszkolubka.jpg', 100),
(40, 'zolciak', 'zolciak.jfif', 100),
(41, 'zlotak', 'zlotak.jpg', 100),
(42, 'zagiew', 'zagiew.jpg', 100);

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `users`
--

CREATE TABLE `users` (
  `id_user` int(11) NOT NULL,
  `username` varchar(30) NOT NULL,
  `login` varchar(40) NOT NULL,
  `password` varchar(40) NOT NULL,
  `score` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Zrzut danych tabeli `users`
--

INSERT INTO `users` (`id_user`, `username`, `login`, `password`, `score`) VALUES
(1, 'admin', 'admin', 'admin', 1375),
(14, 'es', 'es', '123', 75),
(15, 'adin', 'dwa', 'tri', 0),
(16, 'admin1', 'admin1', 'admin', 0),
(17, 'adminasassa', 'fdsafsdafsfsa', 'admin', 0);

--
-- Indeksy dla zrzutów tabel
--

--
-- Indeksy dla tabeli `grzyby`
--
ALTER TABLE `grzyby`
  ADD PRIMARY KEY (`id_grzyba`);

--
-- Indeksy dla tabeli `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id_user`);

--
-- AUTO_INCREMENT dla zrzuconych tabel
--

--
-- AUTO_INCREMENT dla tabeli `grzyby`
--
ALTER TABLE `grzyby`
  MODIFY `id_grzyba` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=43;

--
-- AUTO_INCREMENT dla tabeli `users`
--
ALTER TABLE `users`
  MODIFY `id_user` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
