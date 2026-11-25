SET session_replication_role = replica;

--
-- PostgreSQL database dump
--

-- \restrict FA3nblV7s0ivSgoeThEnnBSXJ1TcBmYtkff3wc7LCCBVeQSwQRYkcECHTh18Q5P

-- Dumped from database version 17.11
-- Dumped by pg_dump version 17.11

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: audit_log_entries; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: custom_oauth_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: flow_state; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: users; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."users" ("instance_id", "id", "aud", "role", "email", "encrypted_password", "email_confirmed_at", "invited_at", "confirmation_token", "confirmation_sent_at", "recovery_token", "recovery_sent_at", "email_change_token_new", "email_change", "email_change_sent_at", "last_sign_in_at", "raw_app_meta_data", "raw_user_meta_data", "is_super_admin", "created_at", "updated_at", "phone", "phone_confirmed_at", "phone_change", "phone_change_token", "phone_change_sent_at", "email_change_token_current", "email_change_confirm_status", "banned_until", "reauthentication_token", "reauthentication_sent_at", "is_sso_user", "deleted_at", "is_anonymous") VALUES
	('00000000-0000-0000-0000-000000000000', 'e735ad47-107b-4e4c-ab86-c9050bb97dcb', 'authenticated', 'authenticated', 'gc120978levelup1@gmail.com', '$2a$10$Pn4bmuul4sj33MDLApDk5uoRSMT8deE7C6nRfcbEvNNCp8THz.u2u', '2026-11-15 04:56:52.153089+00', NULL, '', NULL, '', NULL, '', '', NULL, '2026-11-24 02:23:36.102618+00', '{"provider": "email", "providers": ["email"]}', '{"display_name": "GARRY M. CACHO", "email_verified": true}', NULL, '2026-11-15 04:56:52.143584+00', '2026-11-24 23:38:00.825863+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false);


--
-- Data for Name: identities; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."identities" ("provider_id", "user_id", "identity_data", "provider", "last_sign_in_at", "created_at", "updated_at", "id") VALUES
	('e735ad47-107b-4e4c-ab86-c9050bb97dcb', 'e735ad47-107b-4e4c-ab86-c9050bb97dcb', '{"sub": "e735ad47-107b-4e4c-ab86-c9050bb97dcb", "email": "gc120978levelup1@gmail.com", "email_verified": false, "phone_verified": false}', 'email', '2026-11-15 04:56:52.151309+00', '2026-11-15 04:56:52.151356+00', '2026-11-15 04:56:52.151356+00', '1ae3e630-18f7-42f5-b6e2-ef5bd46bf5c1');


--
-- Data for Name: instances; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: oauth_clients; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sessions; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."sessions" ("id", "user_id", "created_at", "updated_at", "factor_id", "aal", "not_after", "refreshed_at", "user_agent", "ip", "tag", "oauth_client_id", "refresh_token_hmac_key", "refresh_token_counter", "scopes") VALUES
	('70c57ec3-8e02-481f-95e4-5342e90b0c93', 'e735ad47-107b-4e4c-ab86-c9050bb97dcb', '2026-11-20 12:00:09.811281+00', '2026-11-20 12:00:09.811281+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/157.0.0.0 Safari/537.36', '180.194.16.103', NULL, NULL, NULL, NULL, NULL),
	('88722ca2-252c-48ad-a57a-52d5792272c8', 'e735ad47-107b-4e4c-ab86-c9050bb97dcb', '2026-11-24 02:23:33.53064+00', '2026-11-24 02:23:33.53064+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/158.0.0.0 Mobile Safari/537.36', '175.158.243.77', NULL, NULL, NULL, NULL, NULL),
	('af44d4eb-5f58-4935-b62d-3ae5fb261196', 'e735ad47-107b-4e4c-ab86-c9050bb97dcb', '2026-11-24 02:23:33.655192+00', '2026-11-24 02:23:33.655192+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/158.0.0.0 Mobile Safari/537.36', '175.158.243.77', NULL, NULL, NULL, NULL, NULL),
	('bd557fea-9d09-47e4-8785-fdbfb66488c7', 'e735ad47-107b-4e4c-ab86-c9050bb97dcb', '2026-11-24 02:23:36.102708+00', '2026-11-24 02:23:36.102708+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/158.0.0.0 Mobile Safari/537.36', '175.158.243.77', NULL, NULL, NULL, NULL, NULL),
	('0489e4a9-d4fa-4dd4-975a-be4d95842b79', 'e735ad47-107b-4e4c-ab86-c9050bb97dcb', '2026-11-20 19:29:26.134819+00', '2026-11-24 23:38:00.846918+00', NULL, 'aal1', NULL, '2026-11-24 23:38:00.846818', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/158.0.0.0 Safari/537.36', '175.158.243.228', NULL, NULL, NULL, NULL, NULL);


--
-- Data for Name: mfa_amr_claims; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."mfa_amr_claims" ("session_id", "created_at", "updated_at", "authentication_method", "id") VALUES
	('70c57ec3-8e02-481f-95e4-5342e90b0c93', '2026-11-20 12:00:09.847175+00', '2026-11-20 12:00:09.847175+00', 'password', '3a7e6b78-2e34-47ba-8f08-8f2d7a3b7f10'),
	('0489e4a9-d4fa-4dd4-975a-be4d95842b79', '2026-11-20 19:29:26.2163+00', '2026-11-20 19:29:26.2163+00', 'password', 'ebd7fa02-4c0e-4587-89e9-a6fb77ed11c9'),
	('88722ca2-252c-48ad-a57a-52d5792272c8', '2026-11-24 02:23:33.621261+00', '2026-11-24 02:23:33.621261+00', 'password', 'e4f3ce5e-d532-4b18-be7c-a67420eff298'),
	('af44d4eb-5f58-4935-b62d-3ae5fb261196', '2026-11-24 02:23:33.659334+00', '2026-11-24 02:23:33.659334+00', 'password', '6fe99cd1-a32a-4389-93b7-e7235c750434'),
	('bd557fea-9d09-47e4-8785-fdbfb66488c7', '2026-11-24 02:23:36.105266+00', '2026-11-24 02:23:36.105266+00', 'password', 'e575f9ae-7752-4341-8464-2767f5a27b79');


--
-- Data for Name: mfa_factors; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: mfa_challenges; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: mfa_recovery_code_sets; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: mfa_recovery_codes; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: oauth_authorizations; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: oauth_client_states; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: oauth_consents; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: one_time_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: refresh_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."refresh_tokens" ("instance_id", "id", "token", "user_id", "revoked", "created_at", "updated_at", "parent", "session_id") VALUES
	('00000000-0000-0000-0000-000000000000', 205, 'hfuemqkp2y6w', 'e735ad47-107b-4e4c-ab86-c9050bb97dcb', false, '2026-11-20 12:00:09.837365+00', '2026-11-20 12:00:09.837365+00', NULL, '70c57ec3-8e02-481f-95e4-5342e90b0c93'),
	('00000000-0000-0000-0000-000000000000', 206, 'bcsb3jbseqzn', 'e735ad47-107b-4e4c-ab86-c9050bb97dcb', true, '2026-11-20 19:29:26.171547+00', '2026-11-22 00:03:33.236629+00', NULL, '0489e4a9-d4fa-4dd4-975a-be4d95842b79'),
	('00000000-0000-0000-0000-000000000000', 208, 'wld2codn3o6l', 'e735ad47-107b-4e4c-ab86-c9050bb97dcb', false, '2026-11-24 02:23:33.577549+00', '2026-11-24 02:23:33.577549+00', NULL, '88722ca2-252c-48ad-a57a-52d5792272c8'),
	('00000000-0000-0000-0000-000000000000', 209, '33ungotjfvph', 'e735ad47-107b-4e4c-ab86-c9050bb97dcb', false, '2026-11-24 02:23:33.65713+00', '2026-11-24 02:23:33.65713+00', NULL, 'af44d4eb-5f58-4935-b62d-3ae5fb261196'),
	('00000000-0000-0000-0000-000000000000', 210, 'eefkdc7yidb2', 'e735ad47-107b-4e4c-ab86-c9050bb97dcb', false, '2026-11-24 02:23:36.103907+00', '2026-11-24 02:23:36.103907+00', NULL, 'bd557fea-9d09-47e4-8785-fdbfb66488c7'),
	('00000000-0000-0000-0000-000000000000', 207, 'heyhvx67nuu2', 'e735ad47-107b-4e4c-ab86-c9050bb97dcb', true, '2026-11-22 00:03:33.255602+00', '2026-11-24 23:38:00.797728+00', 'bcsb3jbseqzn', '0489e4a9-d4fa-4dd4-975a-be4d95842b79'),
	('00000000-0000-0000-0000-000000000000', 211, 'dgpfmrk2gmhl', 'e735ad47-107b-4e4c-ab86-c9050bb97dcb', false, '2026-11-24 23:38:00.811237+00', '2026-11-24 23:38:00.811237+00', 'heyhvx67nuu2', '0489e4a9-d4fa-4dd4-975a-be4d95842b79');


--
-- Data for Name: sso_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: saml_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: saml_relay_states; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: scim_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: scim_users; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sso_domains; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: webauthn_challenges; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: webauthn_credentials; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE SET; Schema: auth; Owner: supabase_auth_admin
--

SELECT pg_catalog.setval('"auth"."refresh_tokens_id_seq"', 211, true);


--
-- PostgreSQL database dump complete
--

-- \unrestrict FA3nblV7s0ivSgoeThEnnBSXJ1TcBmYtkff3wc7LCCBVeQSwQRYkcECHTh18Q5P

RESET ALL;
