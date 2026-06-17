
# EloPet

Aplicação web fullstack voltada ao gerenciamento e divulgação de animais disponíveis para adoção. Desenvolvida como Projeto Integrador do curso de Análise e Desenvolvimento de Sistemas.

A aplicação é dividida em duas interfaces: uma área pública para visitantes e um painel administrativo autenticado. A comunicação entre frontend e backend ocorre via REST API, com persistência em banco de dados JSON gerenciado pelo JSON Server.

<br>

## Tecnologias

| Camada | Tecnologia |
|---|---|
| Framework | Angular 19 |
| Linguagem | TypeScript 5 |
| Estilização | CSS3 |
| Backend | Node.js + JSON Server |
| Upload de arquivos | Multer |
| Persistência | JSON (db.json) |
| Deploy | Back4App (Container) |

<br>

## Estrutura da Aplicação

O frontend é organizado em componentes standalone do Angular, sem uso de NgModule. Os componentes compartilhados (Header, Footer, Modal) são reutilizados tanto na área pública quanto no painel admin.

O roteamento utiliza `AuthGuard` implementado com `CanActivateFn` para proteger todas as rotas do painel administrativo. Usuários não autenticados são redirecionados para a tela de login.

Os formulários do painel são construídos com Reactive Forms, com validações aplicadas diretamente nos controles.

O backend expõe uma REST API gerada pelo JSON Server, estendida com uma rota customizada (`/upload`) que recebe imagens via `multipart/form-data` e as armazena em `/assets/`. Apenas o nome do arquivo é salvo no banco.

<br>

## Funcionalidades

**Área pública**
- Vitrine de animais disponíveis com espécie, porte, sexo, idade e foto
- Filtros por espécie e porte
- Formulário de registro de interesse com dados do adotante (nome, CPF, RG, e-mail e telefone)
- Sistema de lista de espera por pet

**Painel administrativo**
- Login com sessão controlada via `AuthService`
- Cadastro de pets com campos obrigatórios e upload de imagem
- Edição de todos os dados de um pet já cadastrado
- Remoção de pet com confirmação via modal
- Listagem de interesses de adoção com ação de conceder adoção
- Listagem de animais adotados com dados completos do adotante vinculado
- Vinculação de adotante ao pet por seleção entre os interessados cadastrados
- Reversão de adoção: pet retorna ao status `Disponível` e o campo `adotanteId` é limpo
- Gerenciamento de administradores (adicionar e remover)

<br>

## API

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/pets` | Lista todos os pets cadastrados |
| GET | `/pets/:id` | Retorna um pet pelo ID |
| POST | `/pets` | Cadastra um novo pet |
| PUT | `/pets/:id` | Atualiza todos os campos de um pet |
| PATCH | `/pets/:id` | Atualiza campos específicos de um pet |
| DELETE | `/pets/:id` | Remove um pet |
| GET | `/interesses` | Lista todos os registros de interesse |
| POST | `/interesses` | Registra o interesse de um adotante em um pet |
| PATCH | `/interesses/:id` | Atualiza o status de um interesse |
| DELETE | `/interesses/:id` | Remove um interesse |
| GET | `/usuarios` | Lista os administradores cadastrados |
| POST | `/usuarios` | Adiciona um administrador |
| DELETE | `/usuarios/:id` | Remove um administrador |
| POST | `/upload` | Recebe uma imagem e retorna o nome do arquivo salvo |

<br>

## Modelos de Dados

**Pet**
```json
{
  "id": 1,
  "nome": "Melissa",
  "especie": "Cachorro",
  "sexo": "Fêmea",
  "idade": 6,
  "unidadeIdade": "anos",
  "porte": "Pequeno",
  "status": "Disponível",
  "imagem": "id1.jpeg",
  "descricao": "Muito dócil, carinhosa e adora brincar com crianças.",
  "adotanteId": null
}
```

**Interesse**
```json
{
  "id": 1,
  "petId": 3,
  "nome": "João Silva",
  "cpf": "000.000.000-00",
  "rg": "00.000.000-0",
  "email": "joao@email.com",
  "telefone": "(11) 99999-9999",
  "data": "2025-06-01T10:00:00.000Z",
  "adotado": false,
  "listaEspera": false
}
```

<br>

## Branches

| Branch | Descrição |
|---|---|
| `main` | Versão de produção — configurada para deploy no Back4App via Docker |
| `local` | Versão para execução local — Angular CLI + JSON Server rodando separadamente |

<br>

## Como Executar Localmente

> Consulte o branch `local` para a versão sem as configurações de deploy.

**Pré-requisitos:** Node.js v18+ e Angular CLI v19+

```bash
git clone -b local https://github.com/sthefanyematias/elopet.git
cd elopet
```

**Backend — porta 3000**
```bash
npm install
node server.js
```

**Frontend — porta 4200** (em outro terminal)
```bash
npm install
ng serve
```

**Credenciais de acesso**
```
E-mail: admin@elopet.com
Senha:  1234
```

<br>

## Deploy

O branch `main` contém as configurações necessárias para deploy em container. O `Dockerfile` realiza o build da aplicação Angular e inicializa o servidor Node. O `server.js` unifica frontend e backend na porta `3000`, servindo o build do Angular como SPA e expondo a API do JSON Server na mesma porta, com roteamento configurado para que todas as rotas do painel administrativo sejam corretamente resolvidas.



<!-- <div align="center">

[![EloPet](https://img.shields.io/badge/🐾%20%20EloPet-2868bb?style=for-the-badge&logoColor=white)](https://elopet1-edjtywt2.b4a.run/home)&nbsp;&nbsp;[![Painel Admin](https://img.shields.io/badge/🔐%20%20Admin-fd7217?style=for-the-badge&logoColor=white)](https://elopet1-edjtywt2.b4a.run/admin/login)

</div> -->
