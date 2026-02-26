
-- Team members table: links users to a team owner
CREATE TABLE public.team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_owner_id UUID NOT NULL,
  member_user_id UUID NOT NULL,
  role app_role NOT NULL DEFAULT 'viewer',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (team_owner_id, member_user_id)
);

ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;

-- Team owner can see their team members
CREATE POLICY "Team owners can view members"
  ON public.team_members FOR SELECT
  USING (auth.uid() = team_owner_id);

-- Members can see they belong to a team
CREATE POLICY "Members can view own membership"
  ON public.team_members FOR SELECT
  USING (auth.uid() = member_user_id);

-- Only team owner can add members
CREATE POLICY "Team owners can add members"
  ON public.team_members FOR INSERT
  WITH CHECK (auth.uid() = team_owner_id);

-- Only team owner can update member roles
CREATE POLICY "Team owners can update members"
  ON public.team_members FOR UPDATE
  USING (auth.uid() = team_owner_id);

-- Only team owner can remove members
CREATE POLICY "Team owners can delete members"
  ON public.team_members FOR DELETE
  USING (auth.uid() = team_owner_id);

-- Team invitations table
CREATE TABLE public.team_invitations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_owner_id UUID NOT NULL,
  email TEXT NOT NULL,
  role app_role NOT NULL DEFAULT 'viewer',
  status TEXT NOT NULL DEFAULT 'pending',
  token TEXT NOT NULL DEFAULT encode(extensions.gen_random_bytes(32), 'hex'),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (now() + interval '7 days'),
  UNIQUE (team_owner_id, email)
);

ALTER TABLE public.team_invitations ENABLE ROW LEVEL SECURITY;

-- Team owner can manage invitations
CREATE POLICY "Team owners can view invitations"
  ON public.team_invitations FOR SELECT
  USING (auth.uid() = team_owner_id);

CREATE POLICY "Team owners can create invitations"
  ON public.team_invitations FOR INSERT
  WITH CHECK (auth.uid() = team_owner_id);

CREATE POLICY "Team owners can update invitations"
  ON public.team_invitations FOR UPDATE
  USING (auth.uid() = team_owner_id);

CREATE POLICY "Team owners can delete invitations"
  ON public.team_invitations FOR DELETE
  USING (auth.uid() = team_owner_id);

-- Trigger for updated_at on team_members
CREATE TRIGGER update_team_members_updated_at
  BEFORE UPDATE ON public.team_members
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
