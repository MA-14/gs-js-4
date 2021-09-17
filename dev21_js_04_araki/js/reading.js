const firebaseConfig = {
  apiKey: "AIzaSyCsFautxEr6F1ar7ix5VWgbzBhiY2Jrp2k",
  authDomain: "reading-memo.firebaseapp.com",
  projectId: "reading-memo",
  storageBucket: "reading-memo.appspot.com",
  messagingSenderId: "1091012968399",
  appId: "1:1091012968399:web:61a1d3d7e915a0330b9cba",
  databaseURL: "https://reading-memo-default-rtdb.firebaseio.com/"
};
firebase.initializeApp(firebaseConfig);
const newPostRef = firebase.database();

//input.htmlで検索ボタン押した時
      $(function(){
        $("#search_btn").on("click", function(){
            $("#kouho_list").empty()
            word = $("#search_text").val();
            ajaxSearch(word);
        });

        function ajaxSearch(word){
            $.ajax({
                type: 'get',
                dataType:"jsonp",
                url: 'https://app.rakuten.co.jp/services/api/BooksBook/Search/20170404?',
                data: {
                    applicationId: '1094253165340302230',
                    title : word,
                    format: 'json',
                    formatVersion: "2",
                    hits: '20',
                    page: '1'               
                }
            }).done(function(data){
                setItem(data);
            });
        }

        function setItem(data){
            for (i=0;i<3;i++){
            let html=`
                <li class="kouho_content">
                    <img src="${data.Items[i].largeImageUrl}"id="content_img"> <br>
                    タイトル：<span id="book_title${i}">${data.Items[i].title}</span> <br>
                    著者：<span id="book_author${i}">${data.Items[i].author}</span> <br>
                    レビュー：${data.Items[i].reviewAverage}<br>
                    <button id="book_decide${i}">決定</button>
                </li>`
            $("#kouho_list").append(html);
            localStorage.setItem(JSON.stringify(i),JSON.stringify([data.Items[i].largeImageUrl,data.Items[i].title,data.Items[i].author]));
            }
        }
      });
    
//検索後、決定0ボタンを押した後に遷移
      var from_json_value= "";
      var key ="";
    $("body").on("click", "#book_decide0",function(){
      from_json_value = JSON.parse(localStorage.getItem(JSON.stringify(0)));
      console.log(from_json_value["1"])
    });

    var now = new Date();
    var year = now.getFullYear();
    var month = now.getMonth()+1;
    var date = now.getDate();
    var hour= now.getHours();
    var min= now.getMinutes();
    var sec= now.getSeconds();

//memo.htmlに遷移した時
$(function(){
  book_title = $("#book_title").val();
});

  // 決定ボタンを押すとFirebaseに情報格納
     $("body").on("click", "#book_decide0",function(){
      from_json_value = JSON.parse(localStorage.getItem(JSON.stringify(0)));
      const title = from_json_value["1"]
      newPostRef.ref(title).set({
        title:from_json_value["1"],
        author:from_json_value["2"],
        img:from_json_value["0"],
        time:year+"/"+month+"/"+date+"/"+hour+"/"+min+"/"+sec,
      })
      location.href= "memo.html";
    })

    $("body").on("click", "#book_decide1",function(){
      from_json_value = JSON.parse(localStorage.getItem(JSON.stringify(1)));
      const title = from_json_value["1"]
      newPostRef.ref(title).set({
        title:from_json_value["1"],
        author:from_json_value["2"],
        img:from_json_value["0"],
        time:year+"/"+month+"/"+date+"/"+hour+"/"+min+"/"+sec,
      })
      location.href= "memo.html"
    })

    $("body").on("click", "#book_decide2",function(){
      from_json_value = JSON.parse(localStorage.getItem(JSON.stringify(2)));
      const title = from_json_value["1"];
      newPostRef.ref(title).set({
        title:from_json_value["1"],
        author:from_json_value["2"],
        img:from_json_value["0"],
        time:year+"/"+month+"/"+date+"/"+hour+"/"+min+"/"+sec,
      })
      location.href= "memo.html";
    })



  //メモ追加ボタン押した後
  $("#note_append").on("click",function(){
    if ($("#page").val() == ""){
      alert("ページ数を入力してください！");
      console.log($("#page").val())
    }else if($("#note").val()==""){
      alert("メモを入力してください！");
    }else{
      newPostRef.ref().orderByChild("time").limitToLast(1).on("child_added",function(data){
        v =data.val();
      newPostRef.ref(v.title).push({
        note:
        {page:$("#page").val(),
        note:$("#note").val(),
        date:month+"/"+date}
      })
      $("#page").val("");
      $("#note").val("");
      })
    }
  })

  //別の本を選択を押した後
  $("#another_book_select").on("click",function(){
    location.href= "input.html"
  })
  //履歴を押した後
  $("#rireki_jump").on("click",function(){
    location.href= "rireki.html"
  })
  $("#home_jump").on("click",function(){
    location.href= "index.html"
  })
  

  //履歴画面でタイトル選択
  newPostRef.ref().orderByChild("title").on("child_added",function(data){
    let v=data.val();
    let str =`<option>${v.title}</option>`
    $("#title_select").append(str);
  })


  
  //履歴を表示する本のタイトルを選択し、メモを表示
  $("#title_decide").on("click",function(){
    $("#select_page_title").val("");
    $("#select_page_content").val("");
    $("#select_note_title").val("");
    $("#select_note_content").val("");
    $("#select_content_2").val("");
    $("#selected_content").val("");
    document.getElementById("dispay_selected_book").style.display ="block";
    const d = $("#title_select").val()
    newPostRef.ref(d).on("value",function(data){
      let v = data.val();
      let html=`
          <li class="selected_content">
              <img src="${v.img}"id="selected_img"> <br>
              タイトル：<span id="selected_title">${v.title}</span> <br>
              著者：<span id="selected_author">${v.author}</span> <br>
          </li>`
      $("#dispay_selected_book").append(html);
    })
    
    newPostRef.ref(d).on("child_added",function(data){
      let v = data.val();
      console.log(v.note)
      let str = 
        `<div id="select_contents">
          <div id="select_content_1">
            <div id="select_page_title">ページ数：
              <span id="select_page_content">${v.note.page}</span>
            </div>
            <div id="select_note_title">メモ：</div>
            <div id="select_note_content">${v.note.note}</div>
          </div>
          <div id="select_content_2">${v.note.date}</div>
        </div>`;
      $("#output").prepend(str);
    })
  })

    //Topへを押した後
    $("#rireki_home").on("click",function(){
      location.href= "index.html"
    })
