-- Mockup-alignment pass (launch-07): per-question "Board technique" hint,
-- shown in the paper player while answering. Authored via a HINT: line in the
-- paper format. A writing-technique tip, never part of the answer key.
alter table questions add column if not exists hint text;
