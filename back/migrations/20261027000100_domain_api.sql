ALTER TABLE eventos
    ADD COLUMN IF NOT EXISTS vagas_abertas INTEGER NOT NULL DEFAULT 0;

ALTER TABLE vagas
    ADD COLUMN IF NOT EXISTS open_positions INTEGER NOT NULL DEFAULT 1;

CREATE TABLE IF NOT EXISTS conquistas (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    titulo VARCHAR(80) NOT NULL,
    tipo VARCHAR(20) NOT NULL CHECK (tipo IN ('Evento', 'Campeonato')),
    local VARCHAR(60) NOT NULL DEFAULT '',
    ano VARCHAR(4) NOT NULL DEFAULT ''
);

CREATE INDEX IF NOT EXISTS conquistas_usuario_id_idx ON conquistas(usuario_id);

CREATE TABLE IF NOT EXISTS fotos_perfil (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    imagem TEXT NOT NULL,
    titulo VARCHAR(60) NOT NULL,
    descricao VARCHAR(240) NOT NULL DEFAULT '',
    curtidas INTEGER NOT NULL DEFAULT 0 CHECK (curtidas >= 0),
    curtida_pelo_usuario BOOLEAN NOT NULL DEFAULT FALSE,
    fixada BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE INDEX IF NOT EXISTS fotos_perfil_usuario_id_idx ON fotos_perfil(usuario_id);

CREATE TABLE IF NOT EXISTS preferencias_usuarios (
    usuario_id INTEGER PRIMARY KEY REFERENCES usuarios(id) ON DELETE CASCADE,
    preferencias JSONB NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS inscricoes_eventos_atleta_evento_uq
    ON inscricoes_eventos(atleta_id, evento_id);

CREATE UNIQUE INDEX IF NOT EXISTS candidaturas_atleta_vaga_uq
    ON candidaturas(atleta_id, vaga_id);
