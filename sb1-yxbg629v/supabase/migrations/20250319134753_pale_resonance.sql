/*
  # Create scripts table

  1. New Tables
    - `scripts`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `title` (text)
      - `language` (text)
      - `content` (text[])
      - `created_at` (timestamp)
      - `word_count` (integer)
      - `token_count` (integer)

  2. Security
    - Enable RLS on `scripts` table
    - Add policies for authenticated users to:
      - Read their own scripts
      - Create new scripts
      - Delete their own scripts
*/

CREATE TABLE IF NOT EXISTS scripts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  title text NOT NULL,
  language text NOT NULL,
  content text[] NOT NULL,
  created_at timestamptz DEFAULT now(),
  word_count integer NOT NULL,
  token_count integer NOT NULL
);

ALTER TABLE scripts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own scripts"
  ON scripts
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create scripts"
  ON scripts
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own scripts"
  ON scripts
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);