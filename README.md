# FIXAÇÃO DE CONTEÚDO EM OOP

##  algumas condições para contrução do modelo.

### **[RG-001]** **EXCLUSÃO DE DADOS **

-   **[001]** _Durante o processo de deleção de um cliente, o ID deve ficar inutilizado, não podendo ser reutilizado para futuros cadastros. levar em consideração as regras \*\*_[002]_** e **_[003]\_\*\* deste tópico.

-   **[002]** _Para um usuário excluir sua conta ele deve estar com uma sessão aberta. deve se pedir um identificar como CPF e para concluir os dados da sessão e informado devem ser compatíveis._

-   **[003]** _É permitido a um **admin** excluir qualquer conta. Pessa seus dados de administrador para concluir a operação._

#

### **[RG-101]** **INTERAÇÕES COM PERFIS **

-   **[001]** _É permitido entre as informações postadas, dar like, compartilhar e comentar_
-   **[002]** _Todas as interações são feita apenas pela lista de amigos de cada usuário._

#

### **[RG-201]** **VERIFICAÇÕES E REGISTROS **

-   **[001]** _Para concluir um registro todos os dados devem estar formatados corretamente, seguindos os padrões de verificação estabeleciados para cada campo, são eles: **NOME** - Deve conter pelo menos 3 letras, SENHA - Deve conter um mínimo de 7 caracteres e incluir entre eles ao menos um de cada: letra caixa alta, número, caracter especial, **EMAIL** - Deve conter `@` e ser do domínio ```gmail.com```, **CPF** - Deve seguir os padrões brasileiros e formatados em d3.d3.d3-d2 , **TELEFONE** - Deve conter o **DDD** e ter um minimo de 8 números, **CEP** - Deve seguir os padrões brasileiros._

#

## Requisitos Funcionais

### - O Sistema deve permitir as seguintes opções...

**[RF-001]** _Para acessar o sistema, **deve-se estar cadastrado**, e efetuar o **login**. Para cadastrar deve-se pedir aos usuário suas informações básicas, como: Nome, Sobrenome, Email, Senha, Telefone, Cep, CPF e Endereço, deve-se verificar o dados para conclusão conforme **[RG-201]** de verificações e registros._

**[RF-002]** _Permitir **cadastrar** novo usuário, mesmo com uma sessão aberta._

**[RF-003]** _Permitir **atualizar** os dados de usuário, conforme **RN-001**._

**[RF-004]** _Permitir **excluir** uma conta cadastrada, e **inutilizar** seu número de registro. Conforme **[RG-001]** de exclusão de dados_

**[RF-005]** _Permitir ver lista de amigos, adicionar um novo ou excluir._

**[RF-006]** _Permitir ver lista de amigos recentemente adicionados._

**[RF-007]** _Permitir ver o **perfil** de seus amigos conforme, trazendo suas postagens e permitindo interações conforme **[RG-101]**_

**[RF-008]** _Consultas devem ser parciais, trazendo como o resultado o perfil do usuário que conter algo do que foi informado. Consultas simples devem trazer dados compatíveis com: Nome, Sobrenome, ID de perfil. Deve ser possível tambem separar por categoria, como: Endereço, Email. Para consultas com sessão do tipo **ADMIN** deve se adicionar a alem das opções de **[RF-003]** um novo campo para_ **_CPF_**.

**[RF-009]** _Permitir ao usuário criar [Postagens], que devem conter pelo menos dois campos: Título e Conteúdo. aplicando **[RG-101]** para interações._
