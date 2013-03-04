function nl2br (str, is_xhtml) {
    var breakTag = (is_xhtml || typeof is_xhtml === 'undefined') ? '<br />' : '<br>';
    return (str + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + breakTag + '$2');
}


var db={
	name:'APP_recetas',
	version:'1.0',
	description:'Base de datos para almacenar Recetas',
	size:10,
	con:null,
	ready:false,
	data:null,

	
	conection:function(){
		this.con = window.openDatabase(db.name, db.version, db.description, db.size*1024*1024);	
		this.create();
	},
	
	create:function(){
		this.con.transaction(function(tx){
			tx.executeSql('CREATE TABLE IF NOT EXISTS recetas (id INTEGER PRIMARY KEY AUTOINCREMENT,titulo TEXT, contenido TEXT)');
		}, db.error, db.success);
	},
	
	query:function(consulta,callback){
		var ret=null;
		
		this.ready=false;
		
		this.con.transaction(function(tx){
				tx.executeSql(consulta, [], callback, db.error);
		}, db.error);

	
	},
	

	 error:function(tx, err) {
        alert("Error processing SQL: "+err.message);
		console.log(err);
    },


	success:function() {
        console.log('Success');
		this.ready=true;
    }
	
}