

import pluralize from 'pluralize'

export function buildSql(dbName, objectDefs) {

  let sqlBuilder = ''
  sqlBuilder +=`USE [${dbName}]\r\n GO\r\n\r\n `;
  sqlBuilder +=`SET ANSI_NULLS ON\r\n GO\r\n\r\n  SET QUOTED_IDENTIFIER ON\r\n GO\r\n\r\n  `;

  objectDefs.forEach(def => {

    let key = "Id";
    let tableName = pluralize.plural(def.name);

    sqlBuilder +=`CREATE TABLE [dbo].[${tableName}](\r\n`;

    def.props.forEach((prop, index) => {

      if(index > 0) {sqlBuilder +=`, `}

      if(prop.attrs.indexOf('Key') >=0) { 
        key = prop.prop;
        sqlBuilder +=`[${key}] [int] IDENTITY(1,1) NOT NULL`;
      } else {

	      sqlBuilder +=`[${prop.prop}]`;

        switch(prop.type) {
          case "int": sqlBuilder += ` [int] `;
          break;
          case "string": // start here!!!
          break;
        }

        if(prop.attrs.indexOf('Required') >=0) {          
          sqlBuilder += ` NOT NULL`;
        }
      }

    });



    sqlBuilder +=` CONSTRAINT [PK_${tableName}] PRIMARY KEY CLUSTERED\r\n(\r\n[${key}] ASC\r\n`;    
    sqlBuilder +=`)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]`;
    sqlBuilder +=`) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]\r\n GO\r\n\r\n`;
  });

  return sqlBuilder;
  
}