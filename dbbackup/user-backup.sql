PGDMP                          {            user %   12.14 (Ubuntu 12.14-0ubuntu0.20.04.1)    15.2     �           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false            �           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false            �           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false            �           1262    16804    user    DATABASE     n   CREATE DATABASE "user" WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'C.UTF-8';
    DROP DATABASE "user";
                postgres    false                        2615    2200    public    SCHEMA     2   -- *not* creating schema, since initdb creates it
 2   -- *not* dropping schema, since initdb creates it
                postgres    false            �           0    0    SCHEMA public    ACL     Q   REVOKE USAGE ON SCHEMA public FROM PUBLIC;
GRANT ALL ON SCHEMA public TO PUBLIC;
                   postgres    false    6            �            1259    16807    Users    TABLE     �  CREATE TABLE public."Users" (
    "userId" integer NOT NULL,
    email character varying(255) NOT NULL,
    username character varying(255) NOT NULL,
    "hashedPassword" character varying(255) NOT NULL,
    "hashedRt" character varying(255),
    "isAdmin" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);
    DROP TABLE public."Users";
       public         heap    postgres    false    6            �            1259    16805    Users_userId_seq    SEQUENCE     �   CREATE SEQUENCE public."Users_userId_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 )   DROP SEQUENCE public."Users_userId_seq";
       public          postgres    false    203    6            �           0    0    Users_userId_seq    SEQUENCE OWNED BY     K   ALTER SEQUENCE public."Users_userId_seq" OWNED BY public."Users"."userId";
          public          postgres    false    202                       2604    16810    Users userId    DEFAULT     r   ALTER TABLE ONLY public."Users" ALTER COLUMN "userId" SET DEFAULT nextval('public."Users_userId_seq"'::regclass);
 ?   ALTER TABLE public."Users" ALTER COLUMN "userId" DROP DEFAULT;
       public          postgres    false    202    203    203            �          0    16807    Users 
   TABLE DATA              COPY public."Users" ("userId", email, username, "hashedPassword", "hashedRt", "isAdmin", "createdAt", "updatedAt") FROM stdin;
    public          postgres    false    203   �       �           0    0    Users_userId_seq    SEQUENCE SET     A   SELECT pg_catalog.setval('public."Users_userId_seq"', 20, true);
          public          postgres    false    202                       2606    16818    Users Users_email_key 
   CONSTRAINT     U   ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key" UNIQUE (email);
 C   ALTER TABLE ONLY public."Users" DROP CONSTRAINT "Users_email_key";
       public            postgres    false    203                       2606    16816    Users Users_pkey 
   CONSTRAINT     X   ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_pkey" PRIMARY KEY ("userId");
 >   ALTER TABLE ONLY public."Users" DROP CONSTRAINT "Users_pkey";
       public            postgres    false    203            �   W  x��Wٮ��}��b?��9ȢǤ�QA@��y�Y H#�t_�]��w�{�k�	k&3c�9�0������a����hlA�b���q�@Y��;���;�'�Q�{=Q=�֗�a���L]J�~"�>3wԚh��eU��#�1�ۭ����
��^��c89eZ����{�E[C�+�H<�8*t5�����F�CaE^CH����ŕz�F�C1�o����00ð�"��&(�+�7@Ά(�!( ��7U�� �������f&*jąTN�md�kx� e�}̩�o��j��h���Q�v}��{��%�jQ����~�4�Z���(���M�1x�DW�zK�[g]C�c��K��O�℩�� Id6�]o ���$g>��Q3�a������EF��I�|��.d c�l�\ E�،��r��SCT,,�#E?���2�2���y��z����2�����"�3���B����=C�`�q�o�S��'1c�o�s���	�剛b��wT���~eF�&Z2������J��[�EYO�l��g��#��4�Ip?C��@�����z�u9�GVgݏ�	�͒��ҽF_�U�J����&���jz%���|�!
��|g3��j���sao��a�nDR8�B�1_�wU��\(�V���P��)m[b�+�B9&�Y�W�fH��S���d+!�7�!� 3�������=:(��<����Iª�tv��q��y��*�^xc���ηK ��e>�icNro���:�r����cm/�i�-�n��\Yo�E���n�r��Sz��x��h(E#X�/8�0�rOL��j��t9u큲�-��"!���bT�`��C��=D�3E(�zR���a���0�2��`��������\H����k�7p_K4/7c��'�+���V4fXܩw~s���ҥċj0��q�..������T�\Ʒ^o�v�۫��W��/g!�b���N冝N�j��cΆB�~�0�P��<��@���g��^V��R�ɶ?��C1(_>.[�-V6+i�}���H���O�M����.�v�ݗ�P��L�^�n�n�_�>ۑR�w���s<I�=��iճ���b.����s��<�Q������_ɡgİ�����3B����>���2�5^�دa�	�Jmy���"��[�K1��l*1��/Z��fҘ�����z���>��/�N\:0W�(�!sL
�V��c�Yo���rr��8��b^�Кv���L�u?�t6�A���U��3$I?yaGv�8�����4�Cw�.��)�;�TSBP�3'Ss�s;1�*5�-��C�L2���~K��U�T|�]V[��^�3�>�I!~_��N�O/)9��K�x�[;���	\߄��.�+�eM�
g����d����L�lo�A��N�7����*��i	�����A�f��p���C��%��B�}����������{�4�ƨ�f'k��^?��R|��4M��\�E��k��<�'�6����)�v��*���;�tHY��qhRФPcQLs)���|4�Q-:��T�n��Z�U�a0Ã"4��G�!�|�#�\��L?�^�M��HB�D/)�UO���� B�RN�Epo���0@&v�٭J����S<g^���UXN�m�i��Bg����sι��,�m:�G���V'�n����7�db=<.�/�np��DP���<��p��weP���;��dY�����,y��.+��5�f�ˎ�y��e���Q�k3f-G�) �*e����dm��)~�б�-�����We'�_��C���c?��gW_������ ߾}���Z     