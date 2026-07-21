begin;

-- Emergency cutover guard: the first certificate RPCs trusted learner-writable
-- progress. Keep claims closed until the verified-evidence replacement in the
-- next migration is installed.
revoke execute on function public.issue_vanguard_module_certificate(smallint, text)
  from authenticated;
revoke execute on function public.issue_vanguard_final_certificate(text)
  from authenticated;

commit;
