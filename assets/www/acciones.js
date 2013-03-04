var verId=null;

document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {
		
		db.conection();
		irInicio();	
		
}

function irInicio(){

	$.mobile.changePage('#inicio',{
			transition: "pop",
			changeHash: false	
		});
		
	db.query("SELECT * FROM recetas ORDER BY id DESC",recibirInfo);
	
	function recibirInfo(tx,result){

			var fin=result.rows.length;
			

			var contenido='';
			
			for(var i=0;i<fin;i++)
				contenido+='<li><a href="#" data-id="'+result.rows.item(i).id+'">'+result.rows.item(i).titulo+'</a></li>';
				
			$('#lista').html(contenido).listview('refresh');
			
			$('#lista li a').on('click',function(e){
				e.preventDefault();
				verId=$(this).data('id');
				mostrarInfo();
				
			});	
	
	}
	
}


function mostrarInfo(tx,result){

	if(verId==null){
		irInicio();
		return;
	}
		
	db.query('SELECT * FROM recetas WHERE id='+verId,recibirDatos);
	
	function recibirDatos(tx,result){
	
		$.mobile.changePage('#info',{
			transition: "pop",
			reverse: true,
			changeHash: true	
		});
		
		if(!result.rows.length)
			irInicio();
		
		$('#info #titulo').html(result.rows.item(0).titulo);
		$('#info #contenido').html(nl2br(result.rows.item(0).contenido));
	
	}
}


function editar(){
		
	db.query('SELECT * FROM recetas WHERE id='+verId,recibirDatos);
	

	function recibirDatos(tx,result){

		$('#agregar #idSave').val(verId);
		$('#agregar #saveTitulo').val(result.rows.item(0).titulo);
		$('#agregar #saveContenido').val(result.rows.item(0).contenido);
		
		$.mobile.changePage('#agregar',{
			transition: "slide",
			changeHash: false	
		});	
		
	}

	
}



function guardar(){
	
	var _id=parseInt($('#agregar #idSave').val());
	var _titulo=$.trim($('#agregar #saveTitulo').val());
	var _contenido=$.trim($('#agregar #saveContenido').val());
	
	$('#agregar #idSave').val('0');
	$('#agregar #saveTitulo').val('');
	$('#agregar #saveContenido').val('');
	
	if(_id==0)
		var query="INSERT INTO recetas (titulo,contenido) VALUES('"+_titulo+"','"+_contenido+"')";
	else
		var query="UPDATE recetas SET titulo='"+ _titulo +"',contenido='"+ _contenido +"' WHERE id="+_id;

	db.query(query,db.success);
	irInicio();

}


function eliminar(){
		if(verId==null || verId==0)
	{	
		irInicio();
		return;
	}
	
	db.query("DELETE FROM recetas WHERE id="+verId+"",db.success);
	irInicio();
	
	
}