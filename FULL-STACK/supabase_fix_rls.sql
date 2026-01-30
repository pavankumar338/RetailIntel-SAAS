-- Enable RLS policies for the prediction script to update products
-- CAUTION: This allows public/anon updates. For production, use Service Role Key.

CREATE POLICY "Enable insert for anon" ON "public"."products"
AS PERMISSIVE FOR INSERT
TO public
WITH CHECK (true);

CREATE POLICY "Enable update for anon" ON "public"."products"
AS PERMISSIVE FOR UPDATE
TO public
USING (true)
WITH CHECK (true);
