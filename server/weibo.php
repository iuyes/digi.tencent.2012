<?php
  $template = "./template/appbox.jpg";
	$image = imagecreatefromjpeg($template);   //模板文件
	
  $username = $_REQUEST['username'];
  $select = $_REQUEST['select'];
  $devices = explode('_', $select);
  $config = json_decode('[{"name":"iPhone5","price":5288},{"name":"Windows 8","price":248},{"name":"苹果Retina MacBook Pro 15","price":16488},{"name":"索尼Z13","price":13999},{"name":"东芝Z830","price":7999},{"name":"苹果MacBook Air","price":7388},{"name":"ThinkPad X1 Carbon","price":9699},{"name":"宏碁S7","price":9999},{"name":"联想YOGA","price":6999},{"name":"戴尔 Alienware M18x","price":28999},{"name":"华硕太极","price":10988},{"name":"戴尔XPS 12","price":10999},{"name":"苹果iMac","price":9688},{"name":"索尼VAIO Tap 20","price":7999},{"name":"TP-Link WR720N 3G无线路由器","price":129},{"name":"Amazon Kindle Paperwhite","price":750},{"name":"SONY 55HX950","price":18499},{"name":"LG 84LM9600","price":169999},{"name":"三星UA55ES8000","price":17499},{"name":"夏普LCD-52LX840A","price":13199},{"name":"SONOS无线音箱系统","price":8000},{"name":"罗技UE900","price":2999},{"name":"苹果earpods","price":228},{"name":"任天堂WII U","price":2100},{"name":"iRobot Roomba扫地机器人","price":3480},{"name":"Garmin 2500","price":890},{"name":"菲比电子宠物","price":699},{"name":"Nike+Fuelband","price":1150},{"name":"诺基亚Lumia920","price":4599},{"name":"三星GALAXY S III","price":3599},{"name":"三星GALAXY Note II","price":4899},{"name":"HTC Butterfly","price":4799},{"name":"HTC 8X","price":3999},{"name":"Google Nexus 4","price":1880},{"name":"索尼LT29i","price":3500},{"name":"OPPO Find 5","price":2998},{"name":"魅族MX2","price":2499},{"name":"小米手机2","price":1999},{"name":"步步高 VIVO X1","price":2499},{"name":"三洋爱乐普MB-L2DTC移动应急电源","price":399},{"name":"拉卡拉Q2手机刷卡器","price":199},{"name":"苹果iPad mini","price":2498},{"name":"索尼RX1","price":3759},{"name":"苹果iPad 4","price":3688},{"name":"佳能5D Mark III","price":23499},{"name":"Google Nexus7","price":1300},{"name":"富士X-E1","price":9300},{"name":"微软Surface RT","price":4488},{"name":"索尼NEX-6","price":5499},{"name":"三星Galaxy Note 10.1","price":3328},{"name":"尼康D600","price":15399},{"name":"Amazon Kindle Fire HD 8.9","price":1300},{"name":"三星GALAXY Camera","price":3299},{"name":"索尼NEX-VG900E","price":33566}]');
  
	$image_arr = array();
  $price = 0;
	foreach ($select as $value) {
    $image_arr[] = imagecreatefromjpeg("./template/card$value.jpg");
    $price += $config[$value]['price'];
  }
  
  // 生成设备选择
	$start_x = 35;
	$start_y = 125;
  $count = 0;
	foreach ($image_arr as $img){
		imagecopy($image, $img, $start_x + $count % 4 * 90, $start_y + Math.floor($count / 4) * 132, 0, 0, 83, 118);
	}
  
  // 生成姓名文字
	$font_file = SAE_Font_Sun;
	$font_color = imagecolorallocate($image, 255, 255, 255);
	imagettftext($image, 12, 0, 120, 90, $font_color, $font_file, $username);
  
  // 生成总价格
  
  header("Content-Type: image/jpeg");
  echo $image;
?>
