--
-- PostgreSQL database dump
--

-- Dumped from database version 15.3 (Debian 15.3-1.pgdg110+1)
-- Dumped by pg_dump version 15.2

-- Started on 2023-05-14 00:02:08 MDT

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

DROP DATABASE fitsnitch;
--
-- TOC entry 3374 (class 1262 OID 16384)
-- Name: fitsnitch; Type: DATABASE; Schema: -; Owner: postgres
--

CREATE DATABASE fitsnitch WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'en_US.utf8';


ALTER DATABASE fitsnitch OWNER TO postgres;

\connect fitsnitch

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 4 (class 2615 OID 2200)
-- Name: public; Type: SCHEMA; Schema: -; Owner: pg_database_owner
--

CREATE SCHEMA public;


ALTER SCHEMA public OWNER TO pg_database_owner;

--
-- TOC entry 3375 (class 0 OID 0)
-- Dependencies: 4
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: pg_database_owner
--

COMMENT ON SCHEMA public IS 'standard public schema';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 217 (class 1259 OID 16417)
-- Name: CheatMealEvent; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."CheatMealEvent" (
    "snitchId" text NOT NULL,
    "userId" text NOT NULL,
    "timestamp" timestamp(3) without time zone NOT NULL,
    lat numeric(65,30) NOT NULL,
    lon numeric(65,30) NOT NULL,
    "restaurantName" text NOT NULL
);


ALTER TABLE public."CheatMealEvent" OWNER TO postgres;

--
-- TOC entry 218 (class 1259 OID 16424)
-- Name: DeviceToken; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."DeviceToken" (
    "userId" text NOT NULL,
    token text NOT NULL,
    type text
);


ALTER TABLE public."DeviceToken" OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 16431)
-- Name: PartnerPair; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."PartnerPair" (
    "partnerId1" text NOT NULL,
    "partnerId2" text NOT NULL
);


ALTER TABLE public."PartnerPair" OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 16445)
-- Name: PartnerRequest; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."PartnerRequest" (
    requester text NOT NULL,
    requestee text NOT NULL
);


ALTER TABLE public."PartnerRequest" OWNER TO postgres;

--
-- TOC entry 216 (class 1259 OID 16410)
-- Name: SnitchEvent; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."SnitchEvent" (
    "snitchId" text NOT NULL,
    "userId" text NOT NULL,
    "timestamp" timestamp(3) without time zone NOT NULL,
    lat numeric(65,30) NOT NULL,
    lon numeric(65,30) NOT NULL,
    "restaurantName" text NOT NULL
);


ALTER TABLE public."SnitchEvent" OWNER TO postgres;

--
-- TOC entry 215 (class 1259 OID 16403)
-- Name: TrainerClientPair; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."TrainerClientPair" (
    "trainerId" text NOT NULL,
    "clientId" text NOT NULL
);


ALTER TABLE public."TrainerClientPair" OWNER TO postgres;

--
-- TOC entry 220 (class 1259 OID 16438)
-- Name: TrainerClientRequest; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."TrainerClientRequest" (
    "trainerId" text NOT NULL,
    "clientId" text NOT NULL
);


ALTER TABLE public."TrainerClientRequest" OWNER TO postgres;

--
-- TOC entry 214 (class 1259 OID 16396)
-- Name: User; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."User" (
    "userId" text NOT NULL,
    firstname text NOT NULL,
    lastname text NOT NULL,
    email text NOT NULL,
    image text,
    phone text,
    "cheatmealSchedule" text
);


ALTER TABLE public."User" OWNER TO postgres;

--
-- TOC entry 3364 (class 0 OID 16417)
-- Dependencies: 217
-- Data for Name: CheatMealEvent; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 3365 (class 0 OID 16424)
-- Dependencies: 218
-- Data for Name: DeviceToken; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 3366 (class 0 OID 16431)
-- Dependencies: 219
-- Data for Name: PartnerPair; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public."PartnerPair" VALUES ('user1', 'user2');
INSERT INTO public."PartnerPair" VALUES ('user1', 'user3');
INSERT INTO public."PartnerPair" VALUES ('user1', 'user4');
INSERT INTO public."PartnerPair" VALUES ('testUser1', '00f4d181-6892-432b-814f-ca8bddfa1e2c');
INSERT INTO public."PartnerPair" VALUES ('81885d13-1288-4298-ab5d-eaf85d9b2594', 'cedd436c-1103-4360-85af-ab72e28f2f91');
INSERT INTO public."PartnerPair" VALUES ('81885d13-1288-4298-ab5d-eaf85d9b2594', 'testPartner1');
INSERT INTO public."PartnerPair" VALUES ('81885d13-1288-4298-ab5d-eaf85d9b2594', 'testUser2');
INSERT INTO public."PartnerPair" VALUES ('81885d13-1288-4298-ab5d-eaf85d9b2594', 'testUser3');
INSERT INTO public."PartnerPair" VALUES ('81885d13-1288-4298-ab5d-eaf85d9b2594', 'testUser4');
INSERT INTO public."PartnerPair" VALUES ('81885d13-1288-4298-ab5d-eaf85d9b2594', 'testUser6');


--
-- TOC entry 3368 (class 0 OID 16445)
-- Dependencies: 221
-- Data for Name: PartnerRequest; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public."PartnerRequest" VALUES ('user1', 'user2');
INSERT INTO public."PartnerRequest" VALUES ('user1', 'user3');
INSERT INTO public."PartnerRequest" VALUES ('user1', 'user4');
INSERT INTO public."PartnerRequest" VALUES ('833b9875-e922-45b4-a2c3-c34efdbc3367', 'testId112456');
INSERT INTO public."PartnerRequest" VALUES ('227404b7-f663-47b9-9555-63add16683a8', '8d0bd02e-80d5-4566-8950-ea143726d1d4');
INSERT INTO public."PartnerRequest" VALUES ('81885d13-1288-4298-ab5d-eaf85d9b2594', 'testId11245678');


--
-- TOC entry 3363 (class 0 OID 16410)
-- Dependencies: 216
-- Data for Name: SnitchEvent; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 3362 (class 0 OID 16403)
-- Dependencies: 215
-- Data for Name: TrainerClientPair; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public."TrainerClientPair" VALUES ('00f4d181-6892-432b-814f-ca8bddfa1e2c', 'testUser1');
INSERT INTO public."TrainerClientPair" VALUES ('testTrainer1', 'testClient1');
INSERT INTO public."TrainerClientPair" VALUES ('testTrainer1', 'testClient2');
INSERT INTO public."TrainerClientPair" VALUES ('81885d13-1288-4298-ab5d-eaf85d9b2594', '833b9875-e922-45b4-a2c3-c34efdbc3367');
INSERT INTO public."TrainerClientPair" VALUES ('81885d13-1288-4298-ab5d-eaf85d9b2594', 'testUser2');
INSERT INTO public."TrainerClientPair" VALUES ('81885d13-1288-4298-ab5d-eaf85d9b2594', 'testUser5');


--
-- TOC entry 3367 (class 0 OID 16438)
-- Dependencies: 220
-- Data for Name: TrainerClientRequest; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 3361 (class 0 OID 16396)
-- Dependencies: 214
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public."User" VALUES ('testUser9', 'Test 9', 'User', '9test@email.com', NULL, NULL, NULL);
INSERT INTO public."User" VALUES ('fd45fc37-d721-44c1-9a32-4a3f4ec9effd', 'Andre', 'Miller', 'Andre@frontlinealternative.com', NULL, '''+12109061882', NULL);
INSERT INTO public."User" VALUES ('testUser5', 'Test 5', 'User', '5test@email.com', NULL, NULL, 'week_2');
INSERT INTO public."User" VALUES ('testUser29', 'Test 29', 'User', '29test@email.com', NULL, NULL, NULL);
INSERT INTO public."User" VALUES ('testUser18', 'Test 18', 'User', '18test@email.com', NULL, NULL, NULL);
INSERT INTO public."User" VALUES ('testUser13', 'Test 13', 'User', '13test@email.com', NULL, NULL, NULL);
INSERT INTO public."User" VALUES ('ae2a7b84-8be2-4d81-89f2-1a69c2e0575b', 'Alberto', 'ComeGaivotas', 'fukkegidru@vusra.com', NULL, '''+18018741081', NULL);
INSERT INTO public."User" VALUES ('testUser22', 'Test 22', 'User', '22test@email.com', NULL, NULL, NULL);
INSERT INTO public."User" VALUES ('testUser25', 'Test 25', 'User', '25test@email.com', NULL, NULL, NULL);
INSERT INTO public."User" VALUES ('testUser26', 'Test 26', 'User', '26test@email.com', NULL, NULL, NULL);
INSERT INTO public."User" VALUES ('testUser15', 'Test 15', 'User', '15test@email.com', NULL, NULL, NULL);
INSERT INTO public."User" VALUES ('testUser11', 'Test 11', 'User', '11test@email.com', NULL, NULL, NULL);
INSERT INTO public."User" VALUES ('testUser7', 'Test 7', 'User', '7test@email.com', NULL, NULL, NULL);
INSERT INTO public."User" VALUES ('testUser14', 'Test 14', 'User', '14test@email.com', NULL, NULL, NULL);
INSERT INTO public."User" VALUES ('testUser1', 'Test 1', 'User', '1test@email.com', NULL, NULL, NULL);
INSERT INTO public."User" VALUES ('testUser3', 'Test 3', 'User', '3test@email.com', NULL, NULL, NULL);
INSERT INTO public."User" VALUES ('227404b7-f663-47b9-9555-63add16683a8', 'Trainer', 'Test', 'trainertest@email.com', NULL, NULL, 'month_3');
INSERT INTO public."User" VALUES ('testUser21', 'Test 21', 'User', '21test@email.com', NULL, NULL, NULL);
INSERT INTO public."User" VALUES ('testUser19', 'Test 19', 'User', '19test@email.com', NULL, NULL, NULL);
INSERT INTO public."User" VALUES ('testUser16', 'Test 16', 'User', '16test@email.com', NULL, NULL, NULL);
INSERT INTO public."User" VALUES ('testUser27', 'Test 27', 'User', '27test@email.com', NULL, NULL, NULL);
INSERT INTO public."User" VALUES ('thPzdCEbXRNtTDh2tWVLpJ7yVF02', 'Renzo', 'Caina', 'renzini2018@gmail.com', NULL, NULL, NULL);
INSERT INTO public."User" VALUES ('cedd436c-1103-4360-85af-ab72e28f2f91', 'Test', 'Judd', 'cheetolick311@gmail.com', NULL, NULL, NULL);
INSERT INTO public."User" VALUES ('testUser4', 'Test 4', 'User', '4test@email.com', NULL, NULL, NULL);
INSERT INTO public."User" VALUES ('testUser10', 'Test 10', 'User', '10test@email.com', NULL, NULL, NULL);
INSERT INTO public."User" VALUES ('testUser30', 'Test 30', 'User', '30test@email.com', NULL, NULL, NULL);
INSERT INTO public."User" VALUES ('testUser17', 'Test 17', 'User', '17test@email.com', NULL, NULL, NULL);
INSERT INTO public."User" VALUES ('testUser24', 'Test 24', 'User', '24test@email.com', NULL, NULL, NULL);
INSERT INTO public."User" VALUES ('H71fNMImtbRcbL2NqMcSKNGjMf32', 'FitSnitch', 'Dev', 'fitsnitchdev@gmail.com', NULL, NULL, 'month_20');
INSERT INTO public."User" VALUES ('testUser8', 'Test 8', 'User', '8test@email.com', NULL, NULL, NULL);
INSERT INTO public."User" VALUES ('testUser6', 'Test 6', 'User', '6test@email.com', NULL, NULL, NULL);
INSERT INTO public."User" VALUES ('testUser23', 'Test 23', 'User', '23test@email.com', NULL, NULL, NULL);
INSERT INTO public."User" VALUES ('testUser20', 'Test 20', 'User', '20test@email.com', NULL, NULL, NULL);
INSERT INTO public."User" VALUES ('testUser28', 'Test 28', 'User', '28test@email.com', NULL, NULL, NULL);
INSERT INTO public."User" VALUES ('testUser12', 'Test 12', 'User', '12test@email.com', NULL, NULL, NULL);
INSERT INTO public."User" VALUES ('testUser2', 'Test 2', 'User', '2test@email.com', NULL, NULL, 'week_2');
INSERT INTO public."User" VALUES ('testPartner1', 'Chef', 'Rush', 'chef@rush.com', NULL, NULL, NULL);


--
-- TOC entry 3210 (class 2606 OID 16423)
-- Name: CheatMealEvent CheatMealEvent_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."CheatMealEvent"
    ADD CONSTRAINT "CheatMealEvent_pkey" PRIMARY KEY ("snitchId");


--
-- TOC entry 3212 (class 2606 OID 16430)
-- Name: DeviceToken DeviceToken_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."DeviceToken"
    ADD CONSTRAINT "DeviceToken_pkey" PRIMARY KEY ("userId", token);


--
-- TOC entry 3214 (class 2606 OID 16437)
-- Name: PartnerPair PartnerPair_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PartnerPair"
    ADD CONSTRAINT "PartnerPair_pkey" PRIMARY KEY ("partnerId1", "partnerId2");


--
-- TOC entry 3218 (class 2606 OID 16451)
-- Name: PartnerRequest PartnerRequest_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PartnerRequest"
    ADD CONSTRAINT "PartnerRequest_pkey" PRIMARY KEY (requester, requestee);


--
-- TOC entry 3208 (class 2606 OID 16416)
-- Name: SnitchEvent SnitchEvent_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."SnitchEvent"
    ADD CONSTRAINT "SnitchEvent_pkey" PRIMARY KEY ("snitchId");


--
-- TOC entry 3206 (class 2606 OID 16409)
-- Name: TrainerClientPair TrainerClientPair_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."TrainerClientPair"
    ADD CONSTRAINT "TrainerClientPair_pkey" PRIMARY KEY ("trainerId", "clientId");


--
-- TOC entry 3216 (class 2606 OID 16444)
-- Name: TrainerClientRequest TrainerClientRequest_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."TrainerClientRequest"
    ADD CONSTRAINT "TrainerClientRequest_pkey" PRIMARY KEY ("trainerId", "clientId");


--
-- TOC entry 3204 (class 2606 OID 16402)
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY ("userId");


-- Completed on 2023-05-14 00:02:08 MDT

--
-- PostgreSQL database dump complete
--

