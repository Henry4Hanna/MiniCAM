{
'use strict';
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const C=window.CAM;

/* ================= i18n ================= */
const TX={
 program:['Program','Chương trình'],tools:['Tools','Dao cụ'],fixtures:['Fixtures','Đồ gá'],sim:['Simulator','Mô phỏng'],calc:['Calculator','Máy tính'],setup:['Setup sheet','Phiếu setup'],
 progTitle:['Drawing → G-code','Bản vẽ → G-code'],progSub:['Import a drawing or model (DXF, PDF, STL, STEP), auto-program 2.5D, 3D, 4th- and 5th-axis toolpaths, simulate, then post G-code for ProtoTRAK, Haas, Fanuc, Siemens 840D mills and lathes.','Nhập bản vẽ hoặc mô hình (DXF, PDF, STL, STEP), tự động lập trình 2.5D, 3D, trục 4 và trục 5, mô phỏng rồi xuất G-code cho máy phay và máy tiện ProtoTRAK, Haas, Fanuc, Siemens 840D.'],
 importDxf:['Import DXF','Nhập DXF'],demo:['Demo part','Chi tiết mẫu'],refImg:['Reference photo','Hình tham khảo'],dxfUnits:['DXF units','Đơn vị DXF'],auto:['Auto','Tự động'],
 dwgNote:['DWG is a closed format: in AutoCAD/Fusion/SolidWorks use "Save As DXF" (R12–2018), then import.','DWG là định dạng đóng: trong AutoCAD/Fusion/SolidWorks chọn "Save As DXF" (R12–2018) rồi nhập vào.'],
 noPart:['No part yet — import a DXF or load the demo part.','Chưa có chi tiết — nhập file DXF hoặc mở chi tiết mẫu.'],
 stock:['Stock & zero','Phôi & điểm 0'],sx:['Stock X','Phôi X'],sy:['Stock Y','Phôi Y'],sz:['Stock Z','Phôi Z'],face:['Face allowance','Lượng phay mặt'],partT:['Part thickness','Chiều dày chi tiết'],parAuto:['Auto parallels','Tự chọn căn đệm'],units:['Units','Đơn vị'],
 zero:['Part zero X0 Y0','Điểm 0 X0 Y0'],z0:['Z0 = top of finished part','Z0 = mặt trên chi tiết hoàn thiện'],
 ll:['Lower-left','Góc dưới trái'],tl:['Upper-left','Góc trên trái'],ctr:['Center','Tâm'],lr:['Lower-right','Góc dưới phải'],
 features:['Features found','Đặc trưng tìm thấy'],profile:['Outside profile','Biên ngoài'],pocket:['Pocket','Hốc'],holes:['Holes','Lỗ'],slot:['Open path / slot','Đường hở / rãnh'],
 ops:['Operations','Nguyên công'],autoProg:['Auto program','Tự động lập trình'],addOp:['Add operation','Thêm nguyên công'],gen:['Generate G-code','Xuất G-code'],copy:['Copy','Sao chép'],copied:['Copied','Đã chép'],
 type:['Type','Loại'],feature:['Feature','Đặc trưng'],tool:['Tool','Dao'],zTop:['Z top','Z trên'],zBot:['Z bottom','Z đáy'],doc:['Step-down (DOC)','Ăn sâu (DOC)'],woc:['Step-over (WOC)','Bước ngang (WOC)'],
 leave:['Stock to leave','Chừa lượng dư'],rpm:['RPM','Vòng/phút'],feed:['Feed','Bước tiến'],plunge:['Plunge','Tiến xuống'],ramp:['Ramp °','Góc xuống °'],peck:['Peck Q','Mổ Q'],chamferSz:['Chamfer size','Cỡ vát'],width:['Slot width','Bề rộng rãnh'],
 autoFeeds:['Auto feeds & speeds','Tự tính tốc độ & bước tiến'],del:['Delete','Xóa'],up:['Up','Lên'],down:['Down','Xuống'],
 face_:['Face','Phay mặt'],adaptive:['Adaptive clearing','Phay thô Adaptive'],pocket_:['Pocket clearing','Phay hốc'],contour:['Contour (finish)','Phay biên tinh'],slot_:['Slot','Phay rãnh'],
 spot:['Spot drill','Khoan mồi'],drill:['Drill','Khoan'],tap:['Tap','Taro'],ream:['Ream','Doa'],bore:['Bore (boring bar)','Móc lỗ (cán móc)'],circ:['Circular / helical bore','Phay lỗ xoắn ốc'],chamfer:['Chamfer','Vát mép'],radius:['Corner radius','Bo góc'],
 gcode:['G-code','G-code'],lines:['lines','dòng'],cycle:['Cycle time','Thời gian gia công'],toolsUsed:['tools','dao'],post:['Post','Hậu xử lý'],
 warnTooBig:['tool too large for this feature','dao quá lớn so với đặc trưng'],warnFeature:['wrong feature for this operation','đặc trưng không hợp với nguyên công'],warnNothing:['nothing to cut','không có gì để cắt'],
 verify:['Always verify with the simulator and a dry run (Z raised) before cutting.','Luôn kiểm tra bằng mô phỏng và chạy thử (nâng Z) trước khi cắt thật.'],
 copyHint:['Paste into a text file named PART.nc on a USB stick for the ProtoTRAK (Program In / CAM import).','Dán vào file văn bản tên PART.nc trên USB để nạp vào ProtoTRAK (Program In / CAM).'],
 toolsTitle:['Tool crib','Kho dao'],toolsSub:['Tap a tool to edit. Feeds are computed from tool + material + machine.','Chạm vào dao để sửa. Tốc độ được tính theo dao + vật liệu + máy.'],
 addTool:['Add tool','Thêm dao'],importJson:['Import JSON','Nhập JSON'],exportJson:['Copy library JSON','Chép thư viện JSON'],
 num:['Tool #','Số dao'],desc:['Description','Mô tả'],dia:['Diameter','Đường kính'],flutes:['Flutes','Số me'],tmat:['Tool material','Vật liệu dao'],coat:['Coating','Lớp phủ'],loc:['Flute length','Chiều dài me'],oal:['Overall length','Tổng chiều dài'],stick:['Stick-out','Chiều dài nhô'],
 cornerR:['Corner radius','Bán kính góc'],tipAngle:['Tip angle °','Góc mũi °'],tipDia:['Tip diameter','Đường kính mũi'],pitch:['Pitch (in/thread)','Bước ren'],save:['Done','Xong'],
 fixTitle:['Fixture & workholding','Đồ gá & kẹp phôi'],fixSub:['Pick how the part is held. The drawing checks stick-out against your deepest cut.','Chọn cách kẹp. Hình vẽ kiểm tra phần nhô so với độ sâu cắt lớn nhất.'],
 vise:['Vise','Ê-tô'],softjaw:['Soft jaws','Hàm mềm'],clamps:['Strap clamps','Kẹp bàn'],plate:['Fixture plate','Tấm gá'],collet:['5C collet block','Khối collet 5C'],angle:['Angle plate','Ke góc'],
 jawH:['Jaw height','Chiều cao hàm'],parH:['Parallel height','Chiều cao căn đệm'],viseSize:['Vise width','Bề rộng ê-tô'],stickout:['Stick-out above jaws','Phần nhô trên hàm'],deep:['Deepest cut','Cắt sâu nhất'],
 fixOk:['Clearance OK','Khoảng hở OK'],fixBad:['Cutter can reach the jaws — raise the part or use soft jaws / tabs.','Dao có thể chạm hàm kẹp — nâng phôi hoặc dùng hàm mềm / chừa tab.'],fixLow:['Very little grip — at least 1/8" in the jaws.','Kẹp quá ít — tối thiểu 1/8" trong hàm.'],
 notes:['Notes','Ghi chú'],
 simTitle:['Material-removal simulator','Mô phỏng cắt gọt'],play:['Play','Chạy'],pause:['Pause','Dừng'],reset:['Reset','Làm lại'],next:['Next op','NC tiếp'],speed:['Speed','Tốc độ'],
 view3d:['3D','3D'],viewTop:['Top','Từ trên'],crash:['Rapid into stock!','Chạy nhanh đâm vào phôi!'],noProg:['Generate a program first (Program tab).','Hãy tạo chương trình trước (tab Chương trình).'],
 calcTitle:['Shop calculators','Máy tính xưởng'],sf:['Speeds & feeds','Tốc độ & bước tiến'],tapChart:['Tap drill chart','Bảng mũi khoan taro'],bolt:['Bolt circle','Lỗ trên vòng tròn'],conv:['Converters','Đổi đơn vị'],chamCalc:['Chamfer depth','Độ sâu vát'],
 kind:['Cut type','Kiểu cắt'],sfm:['SFM','SFM'],fz:['Chip load','Lượng ăn/răng'],mrr:['MRR in³/min','MRR in³/phút'],hp:['Spindle HP','Công suất HP'],
 cx:['Center X','Tâm X'],cy:['Center Y','Tâm Y'],bcd:['Bolt circle Ø','Ø vòng lỗ'],count:['Holes','Số lỗ'],start:['Start angle °','Góc bắt đầu °'],holeDia:['Hole Ø','Ø lỗ'],addHoles:['Add holes to part','Thêm lỗ vào chi tiết'],
 setupTitle:['Setup sheet','Phiếu setup'],setupSub:['English + Vietnamese, ready to print. Fill in the header, then print from the full page view.','Song ngữ Anh + Việt, sẵn sàng in. Điền thông tin rồi in từ trang đầy đủ.'],
 print:['Print','In'],printFail:['Printing is blocked in this preview — open the artifact full page, then use Share → Print.','Bản xem trước chặn in — mở trang đầy đủ rồi chọn Chia sẻ → In.'],
 partName:['Part name','Tên chi tiết'],partNo:['Part number','Mã chi tiết'],rev:['Rev','Phiên bản'],qty:['Qty','Số lượng'],programmer:['Programmer','Người lập trình'],operator:['Operator','Thợ đứng máy'],date:['Date','Ngày'],customer:['Customer','Khách hàng'],
 machine:['Machine','Máy'],material:['Material','Vật liệu'],
 dxfSkipped:['Skipped entities (explode blocks / text):','Bỏ qua (hãy explode block / chữ):'],imported:['Imported','Đã nhập'],
 jsonOk:['Imported from JSON','Đã nhập từ JSON'],jsonBad:['JSON format not recognised — send me the file and I will map it.','Không nhận ra định dạng JSON — gửi file để mình map vào.'],
 fit:['Fit','Vừa khung'],paths:['Toolpaths','Đường dao'],
 importAny:['Import file','Nhập file'],tagline:['Import · Simulate · Post','Nhập · Mô phỏng · Xuất'],
 needMesh:['needs an STL model','cần mô hình STL'],needAxes:['needs a {n}-axis machine / rotary','cần máy {n} trục / bàn xoay'],
 lathe:['Lathe','Máy tiện'],latheTitle:['Turning program','Chương trình tiện'],latheSub:['Profile from a DXF half-section (X = axial, Y = radius) or the demo shaft. X is programmed in diameter, Z0 at the part face.','Biên dạng từ DXF nửa mặt cắt (X = dọc trục, Y = bán kính) hoặc trục mẫu. X lập trình theo đường kính, Z0 ở mặt đầu chi tiết.'],
 stockD:['Stock Ø','Ø phôi'],stockL:['Part length','Dài chi tiết'],faceStock:['Face stock','Lượng khỏa mặt'],lface:['Face','Khỏa mặt'],lrough:['OD rough','Tiện thô ngoài'],lfinish:['OD finish (G42)','Tiện tinh ngoài (G42)'],lgroove:['Groove','Cắt rãnh'],lthread:['Thread','Tiện ren'],ldrill:['Center drill / drill','Khoan tâm / khoan'],lpart:['Part off','Cắt đứt'],
 ltools:['Lathe tools','Dao tiện'],insert:['Insert','Mảnh dao'],nose:['Nose radius','Bán kính mũi'],zPos:['Z position','Vị trí Z'],dia:['Diameter','Đường kính'],pitchL:['Pitch','Bước ren'],passes2:['Passes','Số lượt'],depthL:['Depth','Độ sâu'],ipr:['Feed /rev','Tiến /vòng'],sfmL:['SFM (CSS)','SFM (tốc độ cắt không đổi)'],maxRpm:['Max RPM','RPM tối đa'],leaveX:['Leave X','Chừa X'],peckX:['Peck','Mổ'],demoShaft:['Demo shaft','Trục mẫu'],useDxf:['Use imported DXF','Dùng DXF đã nhập'],
 learn:['Learning','Học tập'],mat:['Materials','Vật liệu'],settings:['Settings','Cài đặt'],useShopL:['Use shop data for feeds & speeds','Dùng dữ liệu xưởng để tính tốc độ'],createdBy:['Created by Ryan Nguyen','Tác giả: Ryan Nguyen'],help:['Guide','Hướng dẫn'],
 setTitle:['Settings','Cài đặt'],setSub:['Saved on this device.','Lưu trên thiết bị này.'],display:['Display','Hiển thị'],theme:['Theme','Giao diện'],thAuto:['Auto','Tự động'],thLight:['Light','Sáng'],thDark:['Dark','Tối'],
 layout:['Screen layout','Bố cục màn hình'],lyAuto:['Auto (follow phone)','Tự động (theo điện thoại)'],lyPort:['Portrait','Dọc'],lyLand:['Landscape','Ngang'],
 pageZoom:['Pinch-zoom the whole page','Chụm 2 ngón để zoom cả trang'],viewZoom:['Zoom in drawings & simulator','Zoom trong hình vẽ & mô phỏng'],uiScale:['Text & button size','Cỡ chữ & nút'],
 machDefs:['Machine & G-code','Máy & G-code'],safeZ:['Safe Z (clearance)','Z an toàn'],retractZ:['Retract above top','Nhấc dao trên mặt'],tcSec:['Tool change time (s)','Thời gian thay dao (giây)'],coolant:['Coolant M08','Nước làm mát M08'],
 dataT:['Data','Dữ liệu'],exportProj:['Save project (.json)','Lưu dự án (.json)'],importProj:['Open project / library','Mở dự án / thư viện'],resetAll:['Reset everything','Xoá hết, làm lại từ đầu'],resetConfirm:['Tap again to confirm','Chạm lần nữa để xác nhận'],
 about:['About','Giới thiệu'],helpTitle:['How to use MINI CAM','Cách dùng MINI CAM'],helpSearch:['Search the guide…','Tìm trong hướng dẫn…'],noHits:['Nothing found.','Không tìm thấy.'],
 contourRough:['Contour (rough)','Phay biên thô'],rest:['Rest machining','Phay phần sót (rest)'],surfScallop:['3D scallop (offset)','Phay tinh 3D scallop (offset)'],surfMorph:['3D morph spiral','Phay tinh 3D xoắn morph'],moulding:['Moulding (profile on rail)','Moulding (biên dạng theo đường dẫn)'],
 rotFinish:['4th axis rotary finish (spiral)','Trục 4 – phay tinh tròn xoay (xoắn)'],flow5:['5-axis flow (lead/lag/lean)','5 trục flow (lead/lag/lean)'],deburr5:['5-axis deburr','5 trục vát/bavia cạnh'],
 prof:['Profile','Biên dạng'],cove:['Cove','Lõm (cove)'],round:['Bead / round','Lồi (bead)'],ogee:['Ogee','Ogee (chữ S)'],vprof:['V groove','Rãnh V'],pw:['Profile width','Rộng biên dạng'],pd:['Profile depth','Sâu biên dạng'],
 lead5:['Lead (+) / lag (−) °','Lead (+) / lag (−) °'],lean5:['Lean °','Lean (nghiêng ngang) °'],maxTilt:['Max tilt °','Góc nghiêng tối đa °'],vcarve:['V-carve','Khắc V'],flute:['Fluting','Phay rãnh trang trí (fluting)'],surfWater:['3D waterline','Phay tinh 3D theo đường đồng mức'],surfRadial:['3D radial','Phay tinh 3D hướng tâm'],
 pattern:['Pattern','Kiểu chạy dao'],offsetP:['Offset','Theo biên'],zigzagP:['Zigzag','Zigzag'],refDia:['Previous tool Ø','Ø dao trước'],rampLen:['Ramp length','Chiều dài vào/ra'],
 nest:['Nest','Xếp tấm'],nestTitle:['Nest parts on a sheet','Xếp chi tiết trên tấm phôi'],nestSub:['Place many 2D parts on one sheet, leave holding tabs, and cut the whole sheet in one program.','Xếp nhiều chi tiết 2D lên một tấm, chừa tab giữ, cắt cả tấm trong một chương trình.'],
 sheetW:['Sheet X','Tấm X'],sheetH:['Sheet Y','Tấm Y'],sheetT:['Sheet thickness','Dày tấm'],partT2:['Part thickness','Dày chi tiết'],margin:['Edge margin','Lề tấm'],qtyAuto:['Qty (0 = max)','Số lượng (0 = tối đa)'],
 tabW:['Tab width','Rộng tab'],tabT:['Tab thickness','Dày tab'],tabEvery:['One tab every','Mỗi tab cách'],tabFixed:['Tabs per part (0 = auto)','Số tab mỗi chi tiết (0 = tự động)'],contourTool:['Contour tool','Dao contour'],
 hold:['Hold sheet','Giữ tấm'],screw:['Screws to subplate','Bắt vít xuống subplate'],vacuum:['Vacuum table','Bàn hút chân không'],removal:['Remove tabs','Cắt tab'],breakFile:['Break & file','Bẻ & giũa'],millFix:['Mill on fixture (Setup 2)','Phay trên đồ gá (Setup 2)'],
 parts:['Parts','Chi tiết'],curPart:['Current part','Chi tiết hiện tại'],placed:['placed','đã xếp'],screws:['screw holes','lỗ vít'],tabsN:['tabs','tab'],nestGen:['Make nest G-code','Tạo G-code cả tấm'],
 order:['Machining order','Thứ tự gia công'],tabSection:['Tab section & G-code','Mặt cắt tab & G-code'],tabCheck:['Tab strength check','Kiểm tra sức bền tab'],
 nestMode:['Mode','Chế độ'],flatMode:['Flat sheet (nest on plate)','Tấm phẳng (nest on plate)'],twoSide:['3D two-sided (tabs at parting line)','3D hai mặt (tab ở đường phân khuôn)'],
 bboxNote:['Nesting uses each part\'s bounding rectangle (true-shape nesting comes later).','Xếp theo hình chữ nhật bao quanh chi tiết (xếp theo đúng hình sẽ làm sau).'],
 sampleNote:['Sample parts are synthetic, not shop parts.','Chi tiết mẫu là chi tiết tổng hợp, không phải chi tiết của xưởng.'],
 minW:['Minimize','Thu nhỏ'],maxW:['Maximize','Phóng to'],surfRough:['3D roughing (Z-level)','Phay thô 3D (theo lớp Z)'],surfFinish:['3D parallel finish','Phay tinh 3D song song'],wrap:['4th axis wrap','Trục 4 – quấn biên'],rotRough:['4th axis rotary rough','Trục 4 – phay thô tròn xoay'],swarf:['5-axis draft wall (TCPC)','5 trục – vách nghiêng (TCPC)'],
 defs:['Program defaults','Mặc định lập trình'],stockAuto:['Auto stock height','Tự tính chiều cao phôi'],grip:['Grip in jaws','Phần kẹp trong hàm'],safety:['Safety','An toàn'],roughMethod:['Profile/pocket roughing','Phay thô biên/hốc'],
 byContour:['Contour step-down','Contour từng lớp'],byAdaptive:['Adaptive','Adaptive'],roughDoc:['Rough DOC per pass','Ăn sâu thô mỗi lớp'],finLeave:['Leave for finish','Chừa cho tinh'],finFull:['Finish full depth in 1 pass','Tinh hết chiều sâu 1 lần'],drillCycle:['Drill cycle','Chu trình khoan'],pocketDepth:['Default pocket depth','Độ sâu hốc mặc định'],
 cycle:['Cycle','Chu trình'],dwell:['Dwell (s)','Dừng đáy (giây)'],rings:['Rough rings','Số vòng thô'],aAng:['A index °','A xoay °'],bAng:['B tilt °','B nghiêng °'],cAng:['C rotate °','C xoay °'],wcs:['Work offset','Gốc phôi'],
 wrapD:['Wrap diameter','Đường kính quấn'],d0:['Start Ø','Ø ban đầu'],d1:['Finish Ø','Ø hoàn thiện'],x0:['X start','X bắt đầu'],x1:['X end','X kết thúc'],tilt:['Tilt °','Góc nghiêng °'],
 rotary:['Rotary','Bàn xoay'],axisNote:['4th axis: A turns around X, Z0 on the rotary centerline. 5-axis: verify kinematics and work offsets on the machine — rotary moves are not shown in the simulator.','Trục 4: A xoay quanh X, Z0 ở tâm trục xoay. 5 trục: kiểm tra động học và gốc phôi trên máy — chuyển động trục xoay chưa hiện trong mô phỏng.'],
 model3d:['3D','3D'],view2d:['2D','2D'],exportStl:['Export STL','Xuất STL'],savePdf:['Save PDF','Lưu PDF'],pdfMaking:['Making PDF…','Đang tạo PDF…'],pdfFail:['PDF needs internet to load the renderer — try again online, or Save HTML.','Tạo PDF cần mạng để tải bộ dựng — thử lại khi có mạng, hoặc Lưu HTML.'],
 fromDrawing:['3D model built from the drawing (depths from operations).','Mô hình 3D dựng từ bản vẽ (độ sâu lấy từ nguyên công).'],fmts:['DXF · PDF · STL · STEP · photo','DXF · PDF · STL · STEP · ảnh'],pdfScale:['PDF scale','Tỉ lệ PDF'],
 pdfNote:['PDF: vector lines are read from page 1; dimensions, text and the title block are filtered out. Tap a feature to exclude it.','PDF: đọc nét vẽ ở trang 1; bỏ kích thước, chữ và khung tên. Chạm vào đặc trưng để loại bỏ.'],
 meshNote:['3D model: Z up, machined from the top in one setup. Pocket and hole depths come from the model.','Mô hình 3D: trục Z hướng lên, gia công từ mặt trên trong 1 lần gá. Độ sâu hốc và lỗ lấy từ mô hình.'],
 ignoredFaces:['lower faces outside pockets were ignored (side steps need a 2nd setup or manual ops)','mặt bậc ngoài hốc bị bỏ qua (bậc cạnh cần gá lần 2 hoặc thêm nguyên công tay)'],
 entry:['Entry','Cách vào dao'],helix:['Helical','Xoắn ốc'],rampE:['Ramp','Xuống dốc'],plungeE:['Plunge','Cắm thẳng'],
 lead:['Lead in/out','Vào/ra dao'],leadArc:['Arc','Cung tròn'],leadLine:['Line','Đường thẳng'],leadNone:['None','Không'],leadR:['Lead radius','Bán kính vào dao'],
 corner:['Corner feed %','Feed ở góc %'],passes:['passes','lớp'],through:['through','xuyên'],
 saveFile:['Save file','Lưu file'],saveHtml:['Save HTML','Lưu HTML'],fileType:['File type','Loại file'],
 gcdHint:['.gcd runs G-code directly. .cam makes the ProtoTRAK convert it into conversational events, which you can then save on the control as .pt4 (SMX/KMX) or .pt10 (RMX). G-code on ProtoTRAK may need the Converters option.','.gcd chạy G-code trực tiếp. .cam để ProtoTRAK tự đổi sang chương trình hội thoại (conversational), rồi lưu trên máy thành .pt4 (SMX/KMX) hoặc .pt10 (RMX). Chạy G-code trên ProtoTRAK có thể cần mở khoá tuỳ chọn Converters.'],
 zipHint:['Saved as a .zip (the viewer only allows certain types) — tap it in Files to unzip, then copy the file to USB.','Lưu dạng .zip (trình xem chỉ cho phép vài loại file) — chạm vào file trong ứng dụng Tệp để giải nén rồi chép sang USB.'],
 noSave:['Saving is not available in this view — use Copy.','Không lưu được ở chế độ xem này — hãy dùng Sao chép.'],savedOk:['Saved','Đã lưu'],
 colorBy:['Color by','Tô màu theo'],byOp:['Operation','Nguyên công'],byTool:['Tool','Dao'],byDepth:['Depth','Độ sâu'],hd:['HD','Nét cao'],
 approx:['specs approximate — check your machine plate','thông số gần đúng — kiểm tra bảng máy'],
};
let LANG='vi';
const t=k=>{const v=TX[k];return v?(LANG==='vi'?v[1]:v[0]):k;};
const both=k=>{const v=TX[k];return v?v[0]+' / '+v[1]:k;};

/* ================= state ================= */
const TOOLS0=[
 {num:1,type:'face',desc:'2" Face mill 5 ins.',dia:2,flutes:5,mat:'carbide',coat:'none',loc:0.25,oal:3},
 {num:2,type:'flat',desc:'1/2 3FL end mill',dia:0.5,flutes:3,mat:'carbide',coat:'ZrN',loc:1.25,oal:3},
 {num:3,type:'flat',desc:'3/8 3FL end mill',dia:0.375,flutes:3,mat:'carbide',coat:'ZrN',loc:1,oal:2.5},
 {num:4,type:'flat',desc:'1/4 3FL end mill',dia:0.25,flutes:3,mat:'carbide',coat:'ZrN',loc:0.75,oal:2.5},
 {num:5,type:'flat',desc:'1/8 2FL end mill',dia:0.125,flutes:2,mat:'carbide',coat:'AlTiN',loc:0.5,oal:1.5},
 {num:6,type:'spot',desc:'1/2 90° spot drill',dia:0.5,flutes:2,mat:'carbide',coat:'TiAlN',tipAngle:90,loc:0.6,oal:2.5},
 {num:7,type:'drill',desc:'#7 (.201) drill',dia:0.201,flutes:2,mat:'hss',coat:'black',tipAngle:118,loc:2.4,oal:3.6},
 {num:8,type:'tap',desc:'1/4-20 spiral point tap',dia:0.25,flutes:3,mat:'hss',coat:'none',pitch:0.05,loc:1,oal:2.5},
 {num:9,type:'chamfer',desc:'1/2 90° chamfer mill',dia:0.5,flutes:4,mat:'carbide',coat:'AlTiN',tipAngle:90,tipDia:0.03,loc:0.25,oal:2.5},
 {num:10,type:'reamer',desc:'.2500 reamer',dia:0.25,flutes:6,mat:'carbide',coat:'none',loc:1,oal:3},
 {num:11,type:'boring',desc:'Boring bar .500 min',dia:0.5,flutes:1,mat:'carbide',coat:'TiN',loc:1.5,oal:4},
 {num:12,type:'cornerround',desc:'1/16 R corner rounder',dia:0.5,flutes:4,mat:'hss',coat:'TiN',cornerR:0.0625,tipDia:0.155,loc:0.3,oal:2.5},
 {num:13,type:'bull',desc:'3/8 bull nose .030R',dia:0.375,flutes:3,mat:'carbide',coat:'TiAlN',cornerR:0.03,loc:1,oal:2.5},
 {num:14,type:'ball',desc:'1/4 ball end mill',dia:0.25,flutes:2,mat:'carbide',coat:'AlTiN',loc:0.75,oal:2.5}
];
let uid=1;const nid=p=>p+(uid++)+Math.random().toString(36).slice(2,5);
const S={tab:'program',units:'in',mat:'al6061',machine:'dpmrx2',post:'prototrak',
 stock:{x:4.25,y:3.25,z:1.25,face:0.03,part:0.75},zero:'ll',
 fixture:{type:'vise',jawH:1.75,parH:1.5,parAuto:true,vise:6,notes:''},
 hdr:{name:'BRACKET',no:'P-1001',rev:'A',qty:1,prog:'',oper:'',cust:'',date:new Date(Date.now()-new Date().getTimezoneOffset()*60000).toISOString().slice(0,10),notes:''},
 raw:null,geom:null,feats:[],ops:[],tools:TOOLS0.map(x=>({...x,id:nid('t')})),ref:null,dxfName:'',lineNums:false,toolStop:true};
const OPEN=new Set();let PROG=null,GCODE='',WARN=[],SEGS=[],SEGS4=[],CT=0;const CS=()=>SIMSTATE.axis==='4'?SEGS4:SEGS;
function persist(){try{localStorage.setItem('trakcam',JSON.stringify({...S,ref:null,meshT:null,_hm:null,cylMap:null}));}catch(e){}}
function restore(){try{const j=JSON.parse(localStorage.getItem('trakcam')||'null');if(j&&j.tools){Object.assign(S,j);S.tab=S.tab||'program';return true;}}catch(e){}return false;}

/* ================= units / format ================= */
const K=()=>S.units==='mm'?25.4:1;
const fl=(v,dp)=>{if(v==null||isNaN(v))return'';const k=K();dp=dp??(S.units==='mm'?3:4);return(+(v*k).toFixed(dp)).toString();};
const ulab=()=>S.units==='mm'?'mm':'in';
const flab=()=>S.units==='mm'?'mm/min':'in/min';
const ffd=v=>S.units==='mm'?Math.round(v*25.4):(+v).toFixed(1);
const mat=()=>C.MATERIALS.find(m=>m.id===S.mat)||C.MATERIALS[0];
const mach=()=>C.MACHINES.find(m=>m.id===S.machine)||C.MACHINES[0];
const toolById=id=>S.tools.find(x=>x.id===id);
const featById=id=>S.feats.find(f=>f.id===id);
function toast(s){const e=$('#toast');e.textContent=s;e.classList.add('on');clearTimeout(toast.t);toast.t=setTimeout(()=>e.classList.remove('on'),1800);}
async function copyText(s){try{await navigator.clipboard.writeText(s);toast(t('copied'));}catch(e){const ta=document.createElement('textarea');ta.value=s;document.body.appendChild(ta);ta.select();try{document.execCommand('copy');toast(t('copied'));}catch(_){}ta.remove();}}

/* ================= icons ================= */
const IC={
 program:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h10l6 6v10H4z"/><path d="M14 4v6h6M8 15l2-2-2-2M12 16h4"/></svg>',
 tools:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M9 2h6v7H9z"/><path d="M9 9h6v8l-3 5-3-5z"/><path d="M9 12l6 2M9 15l6 2"/></svg>',
 fixtures:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M2 20h20M4 20v-5h4V8h3v12M20 20v-5h-4V8h-3"/><path d="M11 10h2"/></svg>',
 sim:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M12 3 3 8l9 5 9-5z"/><path d="M3 8v8l9 5 9-5V8"/><path d="M12 13v8"/></svg>',
 calc:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="4" y="2" width="16" height="20" rx="3"/><path d="M8 6h8M8 11h.01M12 11h.01M16 11h.01M8 15h.01M12 15h.01M16 15v4M8 19h4"/></svg>',
 mat:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M3 8l9-5 9 5-9 5z"/><path d="M3 8v8l9 5 9-5V8M12 13v8"/></svg>',
 learn:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M2 9l10-5 10 5-10 5z"/><path d="M6 11v5c3 2 9 2 12 0v-5M22 9v6"/></svg>',
 about:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5v.5"/></svg>',
 settings:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1 7 17M17 7l2.1-2.1"/></svg>',
 help:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 4h7a3 3 0 0 1 3 3v13a2 2 0 0 0-2-2H4zM20 4h-5a3 3 0 0 0-3 3"/><path d="M20 4v14h-6"/></svg>',
 nest:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><rect x="2.5" y="4" width="19" height="16" rx="2"/><rect x="5" y="7" width="6" height="5" rx="1"/><rect x="13" y="7" width="6" height="10" rx="1"/><path d="M5 15h6v2H5z"/></svg>',
 setup:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 2h12v20H6z"/><path d="M9 7h6M9 11h6M9 15h3"/></svg>',
 up:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="m6 15 6-6 6 6"/></svg>',
 down:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="m6 9 6 6 6-6"/></svg>',
 del:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/></svg>',
 plus:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>',
 bolt:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round"><path d="M13 2 4 14h7l-1 8 9-12h-7z"/></svg>',
 play:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 4v16l13-8z"/></svg>',
 pause:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 4h4v16H6zM14 4h4v16h-4z"/></svg>',
 reset:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M4 12a8 8 0 1 0 3-6.2M4 4v5h5"/></svg>',
 next:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M5 4v16l10-8zM16 4h3v16h-3z"/></svg>',
 file:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 3v12M7 10l5 5 5-5M4 21h16"/></svg>',
 img:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="2"/><path d="m21 17-5-5-9 8"/></svg>',
 minus:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M5 12h14"/></svg>',
 fit:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/></svg>',
 path:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M4 18c4 0 4-12 8-12s4 12 8 12"/></svg>',
 save:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M5 3h11l3 3v15H5z"/><path d="M8 3v6h8V3M8 21v-7h8v7"/></svg>',
 copy:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="8" y="8" width="13" height="13" rx="2"/><path d="M16 8V4H3v13h5"/></svg>',
 print:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9V3h12v6M6 18H3v-8h18v8h-3M6 14h12v7H6z"/></svg>',
};
const OPI={surfScallop:'<path d="M12 12m-2 0a2 2 0 1 0 4 0a2 2 0 1 0-4 0M12 12m-6 0a6 6 0 1 0 12 0a6 6 0 1 0-12 0"/>',surfMorph:'<path d="M12 12c0-2 3-2 3 0s-4 4-6 0 3-7 8-3 1 12-7 10-8-10-2-14"/>',moulding:'<path d="M3 8h4a5 5 0 0 0 10 0h4M3 16h18"/>',rotFinish:'<ellipse cx="12" cy="12" rx="4" ry="8"/><path d="M6 6l12 4M6 10l12 4M6 14l12 4"/>',flow5:'<path d="M3 18c4-10 14-10 18 0"/><path d="M12 4l-3 7" stroke-width="3"/>',deburr5:'<path d="M4 20V9l5-5h11"/><path d="M13 3l-6 8" stroke-width="3"/>',rest:'<path d="M4 20V4h16"/><path d="M4 9a5 5 0 0 0 5-5" stroke-width="3"/>',vcarve:'<path d="M4 6l8 12 8-12"/>',flute:'<path d="M3 12c3-6 6 6 9 0s6 6 9 0"/>',surfWater:'<path d="M4 18c3-8 13-8 16 0M7 18c2-5 8-5 10 0"/>',surfRadial:'<path d="M12 12L4 6M12 12l8-6M12 12v8M12 12L4 17M12 12l8 5"/>',surfRough:'<path d="M4 18h16M4 14h16M6 10h12M9 6h6"/>',surfFinish:'<path d="M3 18c4-12 14-12 18 0"/>',wrap:'<ellipse cx="12" cy="12" rx="5" ry="8"/><path d="M7 9h10"/>',rotRough:'<ellipse cx="12" cy="12" rx="4" ry="8"/><path d="M3 12h18"/>',swarf:'<path d="M6 20 10 4M14 20l4-16"/>',face:'<path d="M3 8h18M3 12h18M3 16h18"/>',adaptive:'<path d="M12 12m-1 0a1 1 0 1 1 2 0 3 3 0 1 1-5 0 5 5 0 1 1 9 0 7 7 0 1 1-13 0"/>',pocket:'<rect x="4" y="5" width="16" height="14" rx="3"/><rect x="8" y="9" width="8" height="6" rx="1.5"/>',
 contour:'<path d="M5 19V8a3 3 0 0 1 3-3h11v14z"/><path d="M2 12h3" stroke-dasharray="2 2"/>',slot:'<rect x="3" y="9" width="18" height="6" rx="3"/>',spot:'<path d="M8 3h8v8l-4 8-4-8z"/>',drill:'<path d="M9 2h6v12l-3 6-3-6z"/><path d="M9 6l6 3M9 10l6 3"/>',
 tap:'<path d="M9 2h6v16l-3 4-3-4z"/><path d="M8 6h8M8 9h8M8 12h8M8 15h8"/>',ream:'<path d="M9 2h6v17l-1 2h-4l-1-2z"/><path d="M11 5v13M13 5v13"/>',bore:'<path d="M10 2h4v12h4l-2 4h-6z"/>',circ:'<circle cx="12" cy="12" r="8"/><path d="M12 4a8 8 0 0 1 8 8" stroke-width="3"/>',
 chamfer:'<path d="M4 20V10l6-6h10"/><path d="M4 10l6-6" stroke-width="3"/>',radius:'<path d="M4 20V12a8 8 0 0 1 8-8h8"/>'};
const opIcon=(ty,col,n)=>`<span class="opi" style="background:${col}"><svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${OPI[ty]||''}</svg>${n?`<em>${n}</em>`:''}</span>`;
const OPCOL=['#2457d6','#ff6a13','#1c9b5f','#a347d1','#d93a3a','#0aa3b5','#c48a00','#5c6bc0','#e0457b','#3d8b37'];
const FEATCOL={profile:'#2457d6',pocket:'#7a4fd6',holes:'#1c9b5f',slot:'#ff6a13'};

/* ================= tool drawing ================= */
const COATS={none:['#5f656b','#e9ecef','#a2a8ae','#43484d'],hss:['#7f858b','#fafbfc','#c3c8cc','#565b60'],TiN:['#7b5d17','#ffe58f','#d0a43a','#563f0d'],TiAlN:['#383049','#a597cc','#5f5478','#241f30'],AlTiN:['#1b1d20','#8d939a','#3a3e43','#0e0f11'],ZrN:['#857850','#f6eccb','#c5b484','#5b5236'],black:['#17191b','#6d7278','#2f3236','#0b0c0d']};
let gid=0;
function toolSVG(tl,o){
 o=o||{};const d=Math.max(tl.dia||0.25,0.02),ty=tl.type,loc=tl.loc||d*2.5,oal=Math.max(tl.oal||loc+d*2,loc+0.3);
 let sd=ty==='face'?0.75:ty==='boring'?0.75:ty==='cornerround'?Math.max(d,(tl.tipDia||0.1)+2*(tl.cornerR||0.06)):ty==='tap'?d*0.82:Math.min(d,0.75);
 if(d<0.75&&['flat','ball','bull','drill','reamer','spot','chamfer'].includes(ty))sd=d;
 const id='g'+(gid++);const cc=COATS[tl.coat==='none'&&tl.mat==='hss'?'hss':(tl.coat||'none')]||COATS.none;const sh=COATS[tl.mat==='hss'?'hss':'none'];
 const W=Math.max(d,sd)*1.3,vbw=Math.max(W,oal*0.42),vbh=oal*1.08+(o.dims?oal*0.14:0);
 const grad=(gidn,c)=>`<linearGradient id="${gidn}" x1="0" x2="1"><stop offset="0" stop-color="${c[3]}"/><stop offset=".28" stop-color="${c[1]}"/><stop offset=".55" stop-color="${c[2]}"/><stop offset="1" stop-color="${c[0]}"/></linearGradient>`;
 let defs=grad(id+'s',sh)+grad(id+'b',cc),body='',top=oal*0.04;const y0=top,yb=top+oal;// tip at yb
 const fl0=yb-loc;const r=d/2;
 const shank=(w,y1,y2)=>`<rect x="${-w/2}" y="${y1}" width="${w}" height="${y2-y1}" rx="${w*0.04}" fill="url(#${id}s)"/>`;
 const helix=(clip,w,y1,y2,ang,col,n)=>{let s='';const step=(y2-y1)/Math.max(2,n);for(let y=y1-w*2;y<y2+w;y+=step)s+=`<path d="M${-w/2} ${y}L${w/2} ${y+w*Math.tan(ang)}" stroke="${col}" stroke-width="${w*0.09}" opacity=".55"/>`;return`<g clip-path="url(#${clip})">${s}</g>`;};
 let outline='';
 if(ty==='face'){const bh=Math.min(0.7,loc+0.45);body+=shank(sd,y0,yb-bh);outline=`M${-r} ${yb-bh}H${r}V${yb}H${-r}Z`;
  body+=`<path d="${outline}" fill="url(#${id}s)"/>`;const n=Math.min(tl.flutes||5,7);for(let i=0;i<n;i++){const x=-r+d*(i+0.5)/n;body+=`<path d="M${x-d*0.05} ${yb-0.18}h${d*0.1}l${-d*0.02} 0.18h${-d*0.07}z" fill="url(#${id}b)" stroke="#000" stroke-opacity=".25" stroke-width="${d*0.005}"/>`;}
  body+=`<rect x="${-r}" y="${yb-bh}" width="${d}" height="${bh*0.12}" fill="#000" opacity=".12"/>`;}
 else if(ty==='boring'){const bar=d*0.55;body+=shank(sd,y0,fl0);body+=`<rect x="${-bar/2}" y="${fl0}" width="${bar}" height="${loc}" fill="url(#${id}s)"/>`;body+=`<path d="M${bar/2-0.02} ${yb-0.12}L${r} ${yb-0.06}L${bar/2-0.02} ${yb}Z" fill="url(#${id}b)" stroke="#000" stroke-opacity=".3" stroke-width=".005"/>`;}
 else{
  let tipLen=0;if(['drill','spot','center'].includes(ty))tipLen=r/Math.tan((tl.tipAngle||(ty==='drill'?118:90))/2*Math.PI/180);
  if(ty==='chamfer')tipLen=(r-(tl.tipDia||0)/2)/Math.tan((tl.tipAngle||90)/2*Math.PI/180);
  const cr=ty==='bull'?Math.min(tl.cornerR||0.03,r*0.9):ty==='ball'?r:0;
  body+=shank(sd,y0,fl0+0.001);
  if(ty==='cornerround'){const tr=(tl.tipDia||0.15)/2,R=Math.min(tl.cornerR||0.0625,0.5),big=tr+R,yy=yb-R;
   outline=`M${-sd/2} ${fl0}H${sd/2}V${yy-0.05}H${big}V${yy}A${R} ${R} 0 0 0 ${tr} ${yb}H${-tr}A${R} ${R} 0 0 0 ${-big} ${yy}V${yy-0.05}H${-sd/2}Z`;}
  else if(cr>0){outline=`M${-r} ${fl0}H${r}V${yb-cr}A${cr} ${cr} 0 0 1 ${r-cr} ${yb}H${-r+cr}A${cr} ${cr} 0 0 1 ${-r} ${yb-cr}Z`;}
  else if(tipLen>0){const tr=ty==='chamfer'?(tl.tipDia||0)/2:0;const yc=yb-tipLen;outline=`M${-r} ${fl0}H${r}V${yc}L${tr} ${yb}H${-tr}L${-r} ${yc}Z`;}
  else if(ty==='tap'){let s=`M${-r} ${fl0}H${r}`;const p=Math.max(tl.pitch||0.05,0.01);let y=fl0+p;const ch=p*3;while(y<yb-0.0001){const rr=y>yb-ch?r-(y-(yb-ch))*0.4:r;s+=`L${rr} ${y-p/2}L${rr-p*0.55} ${y}`;y+=p;}s+=`L${r*0.6} ${yb}H${-r*0.6}`;let y2=yb;const left=[];y=fl0+p;while(y<yb-0.0001){const rr=y>yb-ch?r-(y-(yb-ch))*0.4:r;left.push(`L${-rr+p*0.55} ${y}L${-rr} ${y-p/2}`);y+=p;}s+=left.reverse().join('')+'Z';outline=s;}
  else if(ty==='reamer'){outline=`M${-r} ${fl0}H${r}V${yb-d*0.06}L${r-d*0.06} ${yb}H${-r+d*0.06}L${-r} ${yb-d*0.06}Z`;}
  else outline=`M${-r} ${fl0}H${r}V${yb}H${-r}Z`;
  defs+=`<clipPath id="${id}c"><path d="${outline}"/></clipPath>`;
  body+=`<path d="${outline}" fill="url(#${id}b)"/>`;
  const n=Math.round(loc/(d*0.45))+2;
  if(ty==='reamer'||ty==='tap')for(let i=1;i<(ty==='tap'?3:4);i++){const x=-r+d*i/(ty==='tap'?3:4);body+=`<rect x="${x-d*0.03}" y="${fl0}" width="${d*0.06}" height="${loc}" fill="#000" opacity=".28" clip-path="url(#${id}c)"/>`;}
  else if(ty!=='cornerround')body+=helix(id+'c',d,fl0,yb,ty==='drill'?0.5:0.62,'#000',n);
  body+=`<path d="${outline}" fill="none" stroke="#000" stroke-opacity=".35" stroke-width="${d*0.012}"/>`;
 }
 let dims='';
 if(o.dims){const fs=oal*0.055,yy=yb+oal*0.05,c='currentColor';
  dims=`<g fill="${c}" stroke="${c}" stroke-width="${oal*0.004}" font-family="Barlow,system-ui,sans-serif" font-weight="600">
  <path d="M${-r} ${yy}h${d}M${-r} ${yy-fs*0.3}v${fs*0.6}M${r} ${yy-fs*0.3}v${fs*0.6}"/>
  <text x="0" y="${yy+fs*1.15}" font-size="${fs}" stroke="none" text-anchor="middle">Ø${fl(d)}</text>
  <path d="M${W/2+0.04} ${fl0}v${loc}M${W/2} ${fl0}h0.08M${W/2} ${yb}h0.08"/>
  <text x="${W/2+0.07}" y="${fl0+loc/2}" font-size="${fs*0.85}" stroke="none">LOC ${fl(loc,3)}</text></g>`;}
 const lab=o.label?`<title>${esc(tl.desc)}</title>`:'';
 return`<svg viewBox="${-vbw/2} 0 ${vbw} ${vbh}" preserveAspectRatio="xMidYMid meet" role="img">${lab}<defs>${defs}</defs><ellipse cx="0" cy="${yb+oal*0.012}" rx="${Math.max(d,sd)*0.55}" ry="${oal*0.012}" fill="#000" opacity=".12"/>${body}${dims}</svg>`;
}

/* ================= fixture drawing ================= */
function deepestCut(){let z=0;for(const o of S.ops)if(o.on&&o.zBot<z)z=o.zBot;return z;}
function fixtureSVG(type,small){
 const st=S.stock,fx=S.fixture,sx=st.y,sz=st.z;const jaw=fx.jawH,par=fx.parH,so=sz-(jaw-par),deep=-deepestCut();
 const W=Math.max(sx+3.2,7),H=jaw+2.8,ox=W/2;const base=H-0.5;
 const steel='#7c8389',steel2='#a8afb5',dk='#4c5258',blue='#2457d6';
 let s=`<defs><linearGradient id="fxm" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#c5cbd0"/><stop offset="1" stop-color="#7d848a"/></linearGradient><linearGradient id="fxs" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5b83ea"/><stop offset="1" stop-color="#1e46b4"/></linearGradient><pattern id="fxh" width=".18" height=".18" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><path d="M0 0v.18" stroke="#000" stroke-opacity=".15" stroke-width=".04"/></pattern></defs>`;
 s+=`<rect x="0" y="${base}" width="${W}" height="0.5" fill="#5a6066"/><rect x="0" y="${base}" width="${W}" height="0.07" fill="#9aa1a7"/>`;
 const stockTop=base-(type==='clamps'||type==='plate'?0.9+sz:jaw+so),stockY=stockTop;
 const sxL=ox-sx/2;
 if(type==='vise'||type==='softjaw'){
  const bh=0.9,jt=base-bh-jaw;
  s+=`<rect x="${sxL-2.2}" y="${base-bh}" width="${sx+4.4}" height="${bh}" rx=".06" fill="url(#fxm)"/>`;
  const jc=type==='softjaw'?'#d6dadd':'url(#fxm)';
  s+=`<rect x="${sxL-1.4}" y="${jt}" width="1.4" height="${jaw}" fill="${jc}" stroke="${dk}" stroke-width=".02"/><rect x="${sxL+sx}" y="${jt}" width="1.4" height="${jaw}" fill="${jc}" stroke="${dk}" stroke-width=".02"/>`;
  if(type==='softjaw')s+=`<path d="M${sxL-0.12} ${jt}v${so>0?0.25:0}h0.12M${sxL+sx+0.12} ${jt}v0.25h-0.12" stroke="${dk}" stroke-width=".03" fill="none"/>`;
  if(par>0)s+=`<rect x="${sxL+0.05}" y="${base-bh-par}" width="${Math.min(0.35,sx/4)}" height="${par}" fill="${steel2}" stroke="${dk}" stroke-width=".015"/><rect x="${sxL+sx-0.05-Math.min(0.35,sx/4)}" y="${base-bh-par}" width="${Math.min(0.35,sx/4)}" height="${par}" fill="${steel2}" stroke="${dk}" stroke-width=".015"/>`;
  s+=`<rect x="${sxL}" y="${base-bh-par-sz}" width="${sx}" height="${sz}" fill="url(#fxs)" stroke="#16337f" stroke-width=".02"/>`;
  s+=`<rect x="${sxL+sx+1.4}" y="${base-bh-0.35}" width="0.5" height="0.3" fill="${steel}"/><rect x="${sxL+sx+1.9}" y="${base-bh-0.27}" width="1.2" height="0.14" rx=".07" fill="${dk}"/>`;
 }else if(type==='clamps'||type==='plate'){
  const riser=0.9;if(type==='plate')s+=`<rect x="0.2" y="${base-0.75}" width="${W-0.4}" height="0.75" fill="url(#fxm)"/>`;
  s+=`<rect x="${sxL+0.2}" y="${base-riser}" width="0.5" height="${riser-(type==='plate'?0.75:0)}" fill="${steel2}"/><rect x="${sxL+sx-0.7}" y="${base-riser}" width="0.5" height="${riser-(type==='plate'?0.75:0)}" fill="${steel2}"/>`;
  s+=`<rect x="${sxL}" y="${base-riser-sz}" width="${sx}" height="${sz}" fill="url(#fxs)" stroke="#16337f" stroke-width=".02"/>`;
  const ct=base-riser-sz;
  if(type==='clamps'){[[sxL-1.6,1],[sxL+sx+1.6,-1]].forEach(([x,dir])=>{s+=`<rect x="${x-0.25}" y="${ct-0.05}" width="0.5" height="${riser+sz+0.05}" fill="${steel}"/><path d="M${x-dir*0.9} ${ct-0.28}L${x+dir*1.35} ${ct-0.28}L${x+dir*1.35} ${ct}L${x-dir*0.9} ${ct-0.05}Z" fill="${dk}"/><rect x="${x-0.06}" y="${ct-0.9}" width="0.12" height="${riser+sz+0.9}" fill="#9aa1a7"/><rect x="${x-0.2}" y="${ct-0.55}" width="0.4" height="0.24" fill="#cfd4d8" stroke="${dk}" stroke-width=".02"/>`;});}
  else{[sxL-0.25,sxL+sx+0.05].forEach(x=>{s+=`<rect x="${x}" y="${ct-0.08}" width="0.2" height="0.75" fill="#cfd4d8" stroke="${dk}" stroke-width=".02"/>`;});s+=`<circle cx="${sxL+sx/2}" cy="${ct+sz/2}" r=".09" fill="#cfd4d8" stroke="${dk}" stroke-width=".02"/>`;}
 }else if(type==='collet'){
  const b=Math.max(sx,sz)+1.4,cy=base-b/2;s+=`<rect x="${ox-b/2}" y="${base-b}" width="${b}" height="${b}" fill="url(#fxm)" stroke="${dk}" stroke-width=".02"/><circle cx="${ox}" cy="${cy}" r="${Math.max(sx,sz)/2+0.3}" fill="${steel}"/><circle cx="${ox}" cy="${cy}" r="${Math.max(sx,sz)/2}" fill="url(#fxs)" stroke="#16337f" stroke-width=".02"/>`;
 }else if(type==='angle'){
  s+=`<path d="M${sxL-1.2} ${base}V${base-sz-2.2}h0.6V${base-0.6}H${sxL+sx+2}V${base}Z" fill="url(#fxm)" stroke="${dk}" stroke-width=".02"/><rect x="${sxL-0.6}" y="${base-0.6-sx}" width="${sz}" height="${sx}" fill="url(#fxs)" stroke="#16337f" stroke-width=".02"/>`;
 }
 // z0 line + deepest
 let zTop=type==='vise'||type==='softjaw'?base-0.9-par-sz+st.face:type==='clamps'||type==='plate'?base-0.9-sz+st.face:null;
 if(zTop!=null&&!small){const xs=1e-3;s+=`<path d="M0.1 ${zTop}H${W-0.1}" stroke="${'#1c9b5f'}" stroke-width=".025" stroke-dasharray=".12 .08"/><text x="0.15" y="${zTop-0.08}" font-size=".24" fill="#1c9b5f" font-weight="700">Z0</text>`;
  if(deep>0)s+=`<path d="M${sxL-0.5} ${zTop+deep}H${sxL+sx+0.5}" stroke="#ff6a13" stroke-width=".03" stroke-dasharray=".1 .06"/><text x="${sxL+sx+0.55}" y="${zTop+deep+0.08}" font-size=".22" fill="#ff6a13" font-weight="700">Z${fl(-deep,3)}</text>`;}
 return`<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid meet" font-family="Barlow,system-ui,sans-serif">${s}</svg>`;
}
function fixtureCheck(){const st=S.stock,fx=S.fixture;if(!['vise','softjaw'].includes(fx.type))return null;const so=st.z-(fx.jawH-fx.parH),deep=-deepestCut()+st.face;const grip=st.z-so;return{so,deep,bad:deep>so-0.005,low:grip<0.125};}

/* ================= part drawing (svg, program coords) ================= */
function partSVG(o){
 o=o||{};if(!S.geom)return'';const sr=stockRect(),pad=Math.max(sr[2]-sr[0],sr[3]-sr[1])*0.12;const x0=sr[0]-pad,y0=sr[1]-pad,w=sr[2]-sr[0]+2*pad,h=sr[3]-sr[1]+2*pad;const sw=w/300;
 const P=p=>p.map((q,i)=>(i?'L':'M')+q[0].toFixed(4)+' '+(-q[1]).toFixed(4)).join('')+'Z';
 let s=`<rect x="${sr[0]}" y="${-sr[3]}" width="${sr[2]-sr[0]}" height="${sr[3]-sr[1]}" fill="#e9edf2" stroke="#9aa3ab" stroke-width="${sw}" stroke-dasharray="${sw*6} ${sw*4}"/>`;
 for(const f of S.feats){if(f.kind==='profile')s+=`<path d="${P(f.loop)}" fill="#2457d6" fill-opacity=".16" stroke="#2457d6" stroke-width="${sw*1.6}"/>`;}
 for(const f of S.feats){if(f.kind==='pocket'){s+=`<path d="${P(f.loop)}${(f.islands||[]).map(P).join('')}" fill="#fff" fill-rule="evenodd" stroke="#4b2bb0" stroke-width="${sw*1.4}"/>`;}
  if(f.kind==='holes')for(const p of f.pts)s+=`<circle cx="${p[0]}" cy="${-p[1]}" r="${f.dia/2}" fill="#fff" stroke="#1c9b5f" stroke-width="${sw*1.4}"/>`;
  if(f.kind==='slot')s+=`<path d="${f.path.map((q,i)=>(i?'L':'M')+q[0]+' '+(-q[1])).join('')}" fill="none" stroke="#ff6a13" stroke-width="${sw*1.6}"/>`;}
 const zr=w*0.03;s+=`<g><circle r="${zr}" fill="#fff" stroke="#111" stroke-width="${sw*1.2}"/><path d="M0 0V${-zr}A${zr} ${zr} 0 0 1 ${zr} 0ZM0 0V${zr}A${zr} ${zr} 0 0 1 ${-zr} 0Z" fill="#111"/><path d="M0 0H${zr*3.2}M0 0V${-zr*3.2}" stroke="#d93a3a" stroke-width="${sw*1.6}"/><text x="${zr*3.3}" y="${zr*0.4}" font-size="${zr*1.2}" fill="#d93a3a" font-weight="700">X</text><text x="${-zr*0.4}" y="${-zr*3.4}" font-size="${zr*1.2}" fill="#d93a3a" font-weight="700">Y</text></g>`;
 const fs=w*0.035;s+=`<text x="${(sr[0]+sr[2])/2}" y="${-sr[1]+fs*1.4}" font-size="${fs}" text-anchor="middle" fill="#333">${fl(sr[2]-sr[0],3)} × ${fl(sr[3]-sr[1],3)} ${ulab()}</text>`;
 return`<svg viewBox="${x0} ${-y0-h} ${w} ${h}" font-family="Barlow,system-ui,sans-serif" style="width:100%;height:auto;max-height:${o.mh||360}px">${s}</svg>`;
}

/* ================= geometry ================= */
function demoDXF(){
 const tq=Math.tan(Math.PI/8);const lw=(pts,c)=>{let s='0\nLWPOLYLINE\n8\n0\n90\n'+pts.length+'\n70\n'+(c?1:0)+'\n';for(const p of pts){s+='10\n'+p[0]+'\n20\n'+p[1]+'\n';if(p[2])s+='42\n'+p[2]+'\n';}return s;};
 let d='0\nSECTION\n2\nHEADER\n9\n$INSUNITS\n70\n1\n0\nENDSEC\n0\nSECTION\n2\nENTITIES\n';
 d+=lw([[0.25,0],[2.5,0],[2.5,0.5,-1],[3,0.5],[3.75,0.5,tq],[4,0.75],[4,2.75,tq],[3.75,3],[0.25,3,tq],[0,2.75],[0,0.25,tq]],true);
 d+=lw([[1.25,1],[2.1,1,tq],[2.35,1.25],[2.35,2.25,tq],[2.1,2.5],[1.25,2.5,tq],[1,2.25],[1,1.25,tq]],true);
 d+=lw([[1.55,1.6],[1.8,1.6,1],[1.8,1.9],[1.55,1.9,1]],true);
 for(const[x,y]of[[0.375,0.375],[0.375,2.625],[3.625,2.625]])d+='0\nCIRCLE\n8\n0\n10\n'+x+'\n20\n'+y+'\n40\n0.1005\n';
 d+='0\nCIRCLE\n8\n0\n10\n3.25\n20\n1.75\n40\n0.375\n';
 d+='0\nLINE\n8\n0\n10\n2.85\n20\n0.95\n11\n3.6\n21\n0.95\n';
 return d+'0\nENDSEC\n0\nEOF\n';
}
function importDXF(txt,name,uSel){
 const p=C.parseDXF(txt,0.0002);let units=uSel&&uSel!=='auto'?uSel:p.units;
 const g0=C.buildGeom(p,0.0002);const b=C.geomBox(g0);const ext=Math.max(b[2]-b[0],b[3]-b[1]);
 if(!units)units=ext>40?'mm':'in';const sc=units==='mm'?1/25.4:units==='cm'?1/2.54:units==='m'?39.37:1;
 S.raw=C.scaleGeom(g0,sc,0,0);S.dxfName=name;S.excl=[];
 const bb=C.geomBox(S.raw);const w=bb[2]-bb[0],h=bb[3]-bb[1];S.stock.x=+(w+0.25).toFixed(3);S.stock.y=+(h+0.25).toFixed(3);
 applyZero();autoProgram();
 const sk=Object.keys(p.skipped).filter(k=>!['TEXT','MTEXT','DIMENSION','HATCH','POINT','LEADER','SOLID','ATTDEF','VIEWPORT'].includes(k));
 toast(t('imported')+': '+S.feats.length+' '+t('features').toLowerCase());
 if(sk.length)WARN.push(t('dxfSkipped')+' '+sk.join(', '));
}
function applyZero(){
 if(!S.raw)return;const b=C.geomBox(S.raw);let dx,dy;
 if(S.zero==='ll'){dx=-b[0];dy=-b[1];}else if(S.zero==='tl'){dx=-b[0];dy=-b[3];}else if(S.zero==='lr'){dx=-b[2];dy=-b[1];}else{dx=-(b[0]+b[2])/2;dy=-(b[1]+b[3])/2;}
 S._zoff=[dx,dy];S.geom=C.scaleGeom(S.raw,1,dx,dy);const old=S.feats;S.feats=C.classify(S.geom,0.0002);
 // keep op->feature links by id (deterministic ids)
 S.ops.forEach(o=>{if(!featById(o.feat))o.feat=S.feats[0]?.id;});
}
function stockRect(){if(!S.geom)return[0,0,S.stock.x,S.stock.y];const b=C.geomBox(S.geom),cx=(b[0]+b[2])/2,cy=(b[1]+b[3])/2;return[cx-S.stock.x/2,cy-S.stock.y/2,cx+S.stock.x/2,cy+S.stock.y/2];}
function thick(){return Math.max(0.01,S.stock.part||0.75);}
const DEF0={stockAuto:true,grip:0.3,safety:0.1,roughMethod:'contour',roughDoc:0.25,finLeave:0.01,finFull:true,drillCycle:'auto',pocketDepth:0.25};
function syncStock(){S.def={...DEF0,...(S.def||{})};if(S.def.stockAuto)S.stock.z=+(S.stock.part+S.stock.face+S.def.grip+S.def.safety).toFixed(4);}
function autoPar(){const fx=S.fixture;if(!fx.parAuto||!['vise','softjaw'].includes(fx.type))return;const g=(S.def&&S.def.grip)||0.3;fx.parH=+Math.max(0,Math.min(fx.jawH,fx.jawH-g)).toFixed(3);}
function axesAvail(){const mc=mach();if(mc.axes===5)return 5;const r=C.ROTARIES.find(x=>x.id===S.rotary);if(mc.rot&&r&&r.id!=='none')return r.five?5:4;return 3;}

/* ================= operations ================= */
const OPTYPES=['face','adaptive','pocket','contour','rest','slot','spot','drill','tap','ream','bore','circ','chamfer','radius','vcarve','flute','surfRough','surfFinish','surfWater','surfRadial','surfScallop','surfMorph','moulding','wrap','rotRough','rotFinish','swarf','flow5','deburr5'];
const MULTI=['wrap','rotRough','rotFinish','swarf','flow5','deburr5'];const ROT=['wrap','rotRough','rotFinish'];const FIVE=['swarf','flow5','deburr5'];
const opLabel=(ty,o)=>o&&ty==='contour'&&(o.leave||0)>0?t('contourRough'):t({face:'face_',pocket:'pocket_',slot:'slot_'}[ty]||ty);
const KIND={face:'face',adaptive:'adaptive',pocket:'rough',contour:'finish',slot:'slot',spot:'spot',drill:'drill',tap:'tap',ream:'ream',bore:'bore',circ:'circ',chamfer:'chamfer',radius:'radius',surfRough:'rough',surfFinish:'finish',rest:'rough',vcarve:'chamfer',flute:'finish',surfWater:'finish',surfRadial:'finish',surfScallop:'finish',surfMorph:'finish',moulding:'finish',rotFinish:'finish',flow5:'finish',deburr5:'chamfer',wrap:'slot',rotRough:'rough',swarf:'finish'};
function featLabel(f){if(!f)return'—';if(f.kind==='holes')return t('holes')+' Ø'+fl(f.dia,3)+' ×'+f.pts.length;if(f.kind==='slot')return t('slot')+' '+fl(f.len,2);return t(f.kind)+' '+f.id;}
function applyFeeds(o){const tl=toolById(o.tool);if(!tl)return;let kind=KIND[o.type];if(o.type==='slot'&&o.width>tl.dia+0.001)kind='adaptive';
 const r=C.feeds(tl,mat(),kind,{machine:mach()});o.rpm=r.rpm;o.feed=r.feed;o.plunge=r.plunge;o.note=r.note+(r.capped?(r.note?' · ':'')+'RPM max':'');
 if(!o.docFix&&['face','adaptive','pocket','contour','slot','circ','surfRough','wrap','rotRough'].includes(o.type)){o.doc=+Math.max(0.005,Math.min(r.doc||0.1,Math.abs(o.zTop-o.zBot)||r.doc)).toFixed(4);if(o.type!=='contour')o.woc=+Math.max(0.003,r.woc||tl.dia*0.4).toFixed(4);}
 if(o.type==='contour'&&!o.docFix){o.doc=Math.min(Math.abs(o.zTop-o.zBot),(tl.loc||1)*0.95);}
 if(o.type==='surfFinish')o.woc=+(tl.dia*0.08).toFixed(4);
 if(o.type==='drill'&&!o.cycle)o.peck=Math.abs(o.zBot)>tl.dia*3?+(tl.dia*(mat().kp>0.9?0.5:1)).toFixed(4):0;
 o.shop=false;applyShop(o,tl);
}
function newOp(type,feat,tool,extra){const o=Object.assign({id:nid('o'),type,feat,tool,on:true,auto:true,zTop:0,zBot:-0.25,doc:0.25,woc:0.05,leave:0,ramp:2,peck:0,chamfer:0.02,width:0,entry:'helix',lead:'arc',corner:0.6,cycle:'',dwell:0.2,rings:1,a:null,b:null,c:null,wcs:'',wrapD:1,d0:1,d1:0.75,x0:0,x1:1,tilt:5},extra||{});if(o.auto)applyFeeds(o);return o;}
function findTool(pred,sort){const c=S.tools.filter(pred);if(!c.length)return null;c.sort(sort||((a,b)=>b.dia-a.dia));return c[0];}
function ensureTool(spec){let tl=S.tools.find(x=>x.type===spec.type&&Math.abs(x.dia-spec.dia)<0.0015&&(!spec.pitch||Math.abs((x.pitch||0)-spec.pitch)<1e-4));if(tl)return tl;
 tl={...spec,id:nid('t'),num:Math.max(0,...S.tools.map(x=>x.num))+1};S.tools.push(tl);return tl;}
function autoProgram(){
 syncStock();const D=S.def;
 S.ops=[];if(!S.feats.length)return;const th=thick(),m=mat();const ex=new Set(S.excl||[]);const FE=S.feats.filter(f=>!ex.has(f.id));
 const flats=S.tools.filter(x=>x.type==='flat');const fm=findTool(x=>x.type==='face')||flats.sort((a,b)=>b.dia-a.dia)[0];
 if(S.stock.face>0.0005&&fm)S.ops.push(newOp('face',null,fm.id,{zTop:S.stock.face,zBot:0}));
 const pockets=FE.filter(f=>f.kind==='pocket'),profiles=FE.filter(f=>f.kind==='profile');
 const pd0=Math.min(D.pocketDepth,th);const pdep=f=>f.depth!==undefined?(f.depth==null?th+0.02:f.depth):pd0;
 const useC=D.roughMethod==='contour';
 const finDoc=(tl,dep)=>D.finFull?Math.min(dep,(tl.loc||1)*0.95):Math.min(dep,D.roughDoc);
 for(const f of pockets){const b=C.bbox(f.loop),ms=Math.min(b[2]-b[0],b[3]-b[1]);const tl=findTool(x=>x.type==='flat'&&x.dia<=ms*0.45)||findTool(x=>x.type==='flat',(a,b)=>a.dia-b.dia);if(!tl)continue;
  f._tool=tl.id;S.ops.push(newOp(useC?'pocket':'adaptive',f.id,tl.id,useC?{zBot:-pdep(f),leave:D.finLeave,doc:D.roughDoc,docFix:true}:{zBot:-pdep(f),leave:D.finLeave}));}
 const pb=profiles.length?C.bbox(profiles[0].loop):[0,0,0,0];
 for(const f of profiles){const tl=findTool(x=>x.type==='flat'&&x.dia<=0.5&&(x.loc||1)>=Math.min(th+0.05,1.2))||findTool(x=>x.type==='flat');if(!tl)continue;f._tool=tl.id;
  if(useC){const exc=Math.max(S.stock.x-(pb[2]-pb[0]),S.stock.y-(pb[3]-pb[1]))/2*1.42,st=tl.dia*0.75,rings=Math.max(1,Math.ceil((exc+0.02-D.finLeave)/st));
   S.ops.push(newOp('contour',f.id,tl.id,{zBot:-(th+0.02),leave:D.finLeave,doc:D.roughDoc,docFix:true,rings,woc:+st.toFixed(4),lead:'arc'}));}
  else S.ops.push(newOp('adaptive',f.id,tl.id,{zBot:-(th+0.02),leave:D.finLeave}));}
 for(const f of pockets)if(f._tool){const tl=toolById(f._tool);S.ops.push(newOp('contour',f.id,f._tool,{zBot:-pdep(f),doc:finDoc(tl,pdep(f)),docFix:true}));}
 for(const f of profiles)if(f._tool){const tl=toolById(f._tool);S.ops.push(newOp('contour',f.id,f._tool,{zBot:-(th+0.02),doc:finDoc(tl,th+0.02),docFix:true}));}
 const holes=FE.filter(f=>f.kind==='holes');const blind=f=>f.depth!=null&&f.depth!==undefined;
 const spot=findTool(x=>x.type==='spot');
 for(const f of holes){if(f.dia>0.5){const tl=findTool(x=>x.type==='flat'&&x.dia<=f.dia*0.7&&x.dia>=f.dia*0.3)||findTool(x=>x.type==='flat'&&x.dia<f.dia*0.9);if(tl)S.ops.push(newOp('circ',f.id,tl.id,{zBot:blind(f)?-f.depth:-(th+0.02),leave:0}));}}
 const drillHoles=holes.filter(f=>f.dia<=0.5);
 if(spot)for(const f of drillHoles){const dch=Math.min(f.dia+0.02,spot.dia*0.9);S.ops.push(newOp('spot',f.id,spot.id,{zBot:-(dch/2)/Math.tan((spot.tipAngle||90)/2*Math.PI/180),cycle:'G82',dwell:0.2}));}
 for(const f of drillHoles){const tap=C.TAPS.find(x=>Math.abs(x[3]-f.dia)<0.003);const dr=ensureTool({type:'drill',desc:(tap?tap[4]+' ':'')+'Ø'+f.dia.toFixed(4)+' drill',dia:f.dia,flutes:2,mat:'hss',coat:'black',tipAngle:118,loc:Math.max(th+0.5,f.dia*8),oal:Math.max(th+1.5,f.dia*12)});
  const zb=blind(f)?-(f.depth+0.3*f.dia):-(th+0.3*f.dia+0.03);const cyc=D.drillCycle==='auto'?(Math.abs(zb)>3*f.dia?'G83':'G81'):D.drillCycle;
  S.ops.push(newOp('drill',f.id,dr.id,{zBot:zb,cycle:cyc,peck:(cyc==='G83'||cyc==='G73')?+(f.dia*(m.kp>0.9?0.5:1)).toFixed(4):0}));
  if(tap){const tp=ensureTool({type:'tap',desc:tap[0]+' spiral point tap',dia:tap[1],flutes:3,mat:'hss',coat:'none',pitch:tap[2],loc:Math.max(0.75,tap[1]*3),oal:Math.max(2.2,tap[1]*9)});f.tap=tap[0];S.ops.push(newOp('tap',f.id,tp.id,{zBot:blind(f)?-Math.max(tap[2]*3,f.depth-3*tap[2]):-(th+0.05)}));}}
 const ch=findTool(x=>x.type==='chamfer');if(ch)for(const f of profiles)S.ops.push(newOp('chamfer',f.id,ch.id,{chamfer:0.015,zBot:-0.015}));
 if(S.meshT){const bl=findTool(x=>x.type==='ball');const fl_=findTool(x=>x.type==='flat'&&x.dia<=0.5);if(fl_)S.ops.push(newOp('surfRough',null,fl_.id,{zBot:-th,leave:0.02,on:false}));if(bl)S.ops.push(newOp('surfFinish',null,bl.id,{zBot:-th,on:false}));}
}
function opOK(o){const f=featById(o.feat);if(['face','rotRough'].includes(o.type))return true;if(o.type==='rotFinish'||o.type==='flow5')return!!S.meshT;if(o.type.startsWith('surf'))return!!S.meshT;if(!f)return false;
 if(o.type==='flute'||o.type==='moulding')return f.kind==='slot';if(o.type==='deburr5')return f.kind!=='slot';if(o.type==='flow5')return!!S.meshT;if(['rest','vcarve'].includes(o.type))return f.kind==='profile'||f.kind==='pocket';
 if(o.type==='wrap')return true;
 if(['adaptive','pocket','contour','radius','swarf'].includes(o.type))return f.kind==='profile'||f.kind==='pocket';
 if(o.type==='chamfer')return f.kind!=='slot';if(o.type==='slot')return f.kind==='slot';return f.kind==='holes';}
function getHM(){if(!S.meshT||!S.meshInfo)return null;const key=S.zero+'|'+S.stock.part;if(S._hm&&S._hmKey===key)return S._hm;const mi=S.meshInfo,z=S._zoff||[0,0];const b=C.geomBox(S.raw),ext=Math.max(b[2]-b[0],b[3]-b[1]);
 S._hm=C.meshHeightmap(S.meshT,mi.sc,z[0],z[1],mi.zTop*mi.sc,-thick()-0.05,Math.max(ext/320,0.004));S._hmKey=key;return S._hm;}
function getCyl(){if(!S.meshT||!S.meshInfo)return null;if(S.cylMap)return S.cylMap;const sc=S.meshInfo.sc;let y0=1e18,y1=-1e18,z0=1e18,z1=-1e18,x0=1e18,x1=-1e18;for(const t_ of S.meshT)for(let k=0;k<9;k+=3){x0=Math.min(x0,t_[k]);x1=Math.max(x1,t_[k]);y0=Math.min(y0,t_[k+1]);y1=Math.max(y1,t_[k+1]);z0=Math.min(z0,t_[k+2]);z1=Math.max(z1,t_[k+2]);}
 S.cylMap=C.meshCylMap(S.meshT,sc,(y0+y1)/2*sc,(z0+z1)/2*sc,Math.max((x1-x0)*sc/220,0.005),120);return S.cylMap;}
function buildProgram(){
 syncStock();
 WARN=WARN.filter(w=>w.startsWith(t('dxfSkipped'))||w.includes(t('ignoredFaces')));const prog=[];let last=null,first=true,pos=null,lastS=0;const sr=stockRect(),mc=mach(),ax=axesAvail();
 S.ops.forEach((o,i)=>{if(!o.on)return;const tl=toolById(o.tool);if(!tl){WARN.push('#'+(i+1)+': '+t('tool')+'?');return;}
  if(!opOK(o)){WARN.push('#'+(i+1)+' '+opLabel(o.type)+': '+(o.type.startsWith('surf')?t('needMesh'):t('warnFeature')));return;}
  const need=FIVE.includes(o.type)?5:ROT.includes(o.type)||o.a!=null?4:(o.b!=null||o.c!=null)?5:3;if(need>ax)WARN.push('#'+(i+1)+' '+opLabel(o.type)+': '+t('needAxes').replace('{n}',need)+' ('+mc.name+')');
  const ctx={tool:tl,feat:featById(o.feat)||{kind:'none'},stockRect:sr,clear:SETS().safeZ,retract:SETS().retract,tol:0.0002,pos,hm:(o.type.startsWith('surf')||o.type==='flow5')?getHM():null,cyl:o.type==='rotFinish'?getCyl():null};
  const r=C.genOp(o,ctx);r.warn.forEach(w=>WARN.push('#'+(i+1)+' '+opLabel(o.type)+': '+(w==='tooBig'?t('warnTooBig'):w==='nothing'?t('warnNothing'):w==='feature'?t('warnFeature'):w==='mesh'?t('needMesh'):w)));
  if(!r.moves.length)return;
  const idx=o.a!=null||o.b!=null||o.c!=null||o.wcs;
  prog.push({t:'op',i,multi:ROT.includes(o.type)?'rot':(o.a||o.b||o.c)?'idx':false,name:(i+1)+' '+(TX[{face:'face_',pocket:'pocket_',slot:'slot_'}[o.type]||o.type]||[o.type])[0]+' '+(featById(o.feat)?featLabelEN(featById(o.feat)):'')});
  const fm=r.moves.find(m=>m.x!==undefined)||{x:0,y:0};
  if(last!==tl.id){prog.push({t:'tool',tool:{num:tl.num,desc:tl.desc+' D'+(+tl.dia.toFixed(4))},idx:S.tools.indexOf(tl)});prog.push({t:'spin',s:o.rpm,first});if(idx)prog.push({t:'index',a:o.a,b:o.b,c:o.c,wcs:o.wcs,dwo:o.b!=null&&mc.axes===5});prog.push({t:'g43',x:fm.x,y:fm.y,h:tl.num});first=false;last=tl.id;lastS=o.rpm;}
  else{if(o.rpm!==lastS){prog.push({t:'spin',s:o.rpm});lastS=o.rpm;}if(idx)prog.push({t:'index',a:o.a,b:o.b,c:o.c,wcs:o.wcs,dwo:o.b!=null&&mc.axes===5});}
  prog.push(...r.moves);if(idx&&o.b!=null&&mc.axes===5)prog.push({t:'dwoOff'});pos=r.end;});
 PROG=prog;
 const k=K(),scale=b=>{if(b.t==='cycle')return{...b,pts:b.pts.map(p=>[p[0]*k,p[1]*k]),z:b.z*k,r:b.r*k,q:b.q*k,f:b.f*k,clear:b.clear*k};if(b.t==='g43')return{...b,x:b.x*k,y:b.y*k};if(b.g!==undefined){const o={...b,x:b.x*k,y:b.y*k,z:b.z*k};if(b.f&&!b.inv)o.f=b.f*k;if(b.g>1){o.i=b.i*k;o.j=b.j*k;}return o;}return b;};
 const m=mat();GCODE=(S.post==='siemens'?C.postSiemens:C.post)(prog.map(scale),{units:S.units,clear:SETS().safeZ*k,post:S.post,name:S.hdr.name,progNo:1001,coolant:SETS().coolant,lineNums:S.lineNums,toolStop:S.toolStop,
  header:['MINI CAM BY RYAN NGUYEN '+S.hdr.date,'MACHINE '+mc.name+(S.rotary&&S.rotary!=='none'?' + '+C.ROTARIES.find(x=>x.id===S.rotary).name:''),'MATERIAL '+m.en,'STOCK '+fl(S.stock.x,3)+' X '+fl(S.stock.y,3)+' X '+fl(S.stock.z,3)+' '+ulab(),'X0 Y0 '+({ll:'LOWER LEFT',tl:'UPPER LEFT',lr:'LOWER RIGHT',c:'CENTER'}[S.zero])+' - Z0 TOP OF FINISHED PART']});
 SEGS=C.simSegs(prog,1);SEGS4=C.simSegs4(prog);const tc=prog.filter(b=>b.t==='tool').length;CT=C.cycleTime(SEGS,mc.rapid,tc,SETS().tcSec);
 const b=C.geomBox(S.geom||{loops:[],circles:[],opens:[]});if(S.geom&&(b[2]-b[0]>mc.tx||b[3]-b[1]>mc.ty))WARN.push(mc.name+': travel X'+mc.tx+' Y'+mc.ty+' in');
 autoPar();const fc=fixtureCheck();if(fc&&fc.bad)WARN.push(t('fixBad'));if(fc&&fc.low)WARN.push(t('fixLow'));
 SIMSTATE.dirty=true;MODEL=null;persist();
}
function featLabelEN(f){if(f.kind==='holes')return'HOLES D'+f.dia.toFixed(4)+' X'+f.pts.length;return f.kind.toUpperCase()+' '+f.id;}
let regenT=0;function regen(){clearTimeout(regenT);regenT=setTimeout(()=>{buildProgram();if(S.tab==='program'){renderOps();renderCode();drawView();}},120);}

/* ================= render shell ================= */
const TABS=['program','nest','tools','mat','fixtures','sim','calc','setup','learn','help','settings','about'];
const TABCOL={mat:'#6b737a',learn:'#c2410c',about:'#2457d6',help:'#3d8b37',settings:'#5c6b7a',nest:'#e39b00',program:'#2457d6',tools:'#ff6a13',fixtures:'#1c9b5f',sim:'#8b4fd6',calc:'#0a9bb0',setup:'#e0457b'};
function lumi(h){const c=hexRGB(h);return(0.299*c[0]+0.587*c[1]+0.114*c[2])/255;}
function renderShell(){
 $('#tabs').innerHTML=TABS.map(k=>`<button data-tab="${k}" class="${S.tab===k?'on':''}" style="--c:${TABCOL[k]}" aria-label="${esc(t(k))}"><span class="ti">${IC[k]}</span><span>${esc(t(k))}</span></button>`).join('');
 $('#selMat').innerHTML=C.MATERIALS.map(m=>`<option value="${m.id}" ${m.id===S.mat?'selected':''}>${esc(LANG==='vi'?m.vi:m.en)}</option>`).join('');
 $('#selMachine').innerHTML=C.MACHINES.map(m=>`<option value="${m.id}" ${m.id===S.machine?'selected':''}>${esc(m.name)}</option>`).join('');
 const mc=mach(),m=mat();$('#lblMach').textContent=t('machine')+' · '+mc.rpmMax+' rpm';$('#valMach').textContent=mc.name.replace(/^TRAK /,'').replace(/ \(.*\)$/,'');
 $('#lblMat').textContent=t('material');$('#valMat').textContent=LANG==='vi'?m.vi:m.en;const mi=$('#matIc');mi.style.background=`linear-gradient(135deg,${m.color},color-mix(in srgb,${m.color} 55%,#000))`;mi.querySelector('svg').setAttribute('stroke',lumi(m.color)>0.72?'#1d2328':'#fff');$('#tagline').textContent=t('tagline');$$('#langSeg button').forEach(b=>b.classList.toggle('on',b.dataset.l===LANG));document.documentElement.lang=LANG;
}
function render(){applySettings();document.body.classList.remove('noscroll');document.body.style.setProperty('--tc',TABCOL[S.tab]||'#2457d6');renderShell();const fn={mat:rMat,learn:rLearn,about:rAbout,settings:rSettings,help:rHelp,nest:rNest,program:rProgram,tools:rTools,fixtures:rFixtures,sim:rSim,calc:rCalc,setup:rSetup}[S.tab];SIMSTATE.playing=false;$('#main').innerHTML='';fn();window.scrollTo(0,0);}
const inp=(k,v,attrs)=>`<label class="f">${esc(t(k))}<input inputmode="decimal" ${attrs||''} value="${esc(v)}"></label>`;

/* ----- program tab ----- */
function rProgram(){if(mach().type==='lathe'){rLathe();return;}
 const z=S.zero;
 $('#main').innerHTML=`<h1>${t('progTitle')}</h1><p class="sub">${t('progSub')}</p>
 <div class="grid g2">
  <div class="grid" style="align-content:start">
   <div class="view" id="pv"><canvas id="pvc"></canvas>${S.geom?'':`<div class="empty"><div><p>${t('noPart')}</p><div class="row" style="justify-content:center"><button class="btn pri" data-act="import">${IC.file}${t('importAny')}</button><button class="btn" data-act="demo">${t('demo')}</button></div></div></div>`}
    <div class="ovl tr"><button class="mini" data-act="zIn" aria-label="zoom in">${IC.plus}</button><button class="mini" data-act="zOut" aria-label="zoom out">${IC.minus}</button><button class="mini" data-act="fit" aria-label="${t('fit')}">${IC.fit}</button><button class="mini" data-act="togglePaths" aria-label="${t('paths')}" style="${VIEW.paths?'color:var(--blue)':''}">${IC.path}</button></div>
    <div class="ovl bl"><span class="pill" id="pvInfo"></span></div>
    <div class="ovl tl"><div class="seg" id="pvMode"><button data-pv="2d" class="${VIEW.mode!=='3d'?'on':''}">${t('view2d')}</button><button data-pv="3d" class="${VIEW.mode==='3d'?'on':''}">${t('model3d')}</button></div></div></div>
   <div class="card"><div class="row" style="justify-content:space-between"><h2 style="margin:0">${t('features')}</h2>${S.geom?`<button class="btn sm" data-act="stl">${IC.save}${t('exportStl')}</button>`:''}</div><p class="sub" style="margin:4px 0 8px;font-size:13px">${VIEW.mode==='3d'?t('fromDrawing'):''}</p><div class="feats">${S.feats.map(f=>`<button class="feat ${(S.excl||[]).includes(f.id)?'off':''}" data-feat="${f.id}"><i class="dot" style="background:${FEATCOL[f.kind]}"></i>${esc(featLabel(f))}${f.tap?' · '+esc(f.tap):''}${f.kind!=='profile'&&f.depth!==undefined?' · '+(f.depth==null?t('through'):'↧'+fl(f.depth,3)):''}</button>`).join('')||'<span class="sub">—</span>'}</div></div>

   <div class="row"><button class="btn pri" data-act="import" style="flex:1 1 220px;min-height:56px;justify-content:flex-start">${IC.file}<span style="display:grid;text-align:left;line-height:1.15">${t('importAny')}<small style="font-weight:500;opacity:.85;font-size:12.5px">${t('fmts')}</small></span></button><button class="btn" data-act="demo">${t('demo')}</button><button class="btn" data-act="img">${IC.img}${t('refImg')}</button></div>
   <div class="row"><label class="chip">${t('dxfUnits')} <select id="dxfU"><option value="auto">${t('auto')}</option><option value="in">in</option><option value="mm">mm</option></select></label><label class="chip">${t('pdfScale')} 1 : <input id="pdfSc" inputmode="decimal" value="${S.pdfScale||1}" style="width:48px;border:0;background:none;font:inherit;font-size:16px"></label></div>
   <p class="sub" style="margin:0;font-size:13.5px">${S.src==='pdf'?t('pdfNote'):S.src==='mesh'?t('meshNote'):t('dwgNote')}${S.dxfName?' · <b>'+esc(S.dxfName)+'</b>':''}</p>
   ${S.ref?`<img src="${S.ref}" alt="" style="max-width:100%;border-radius:12px;border:1px solid var(--line)">`:''}
   <div class="card"><h2>${t('gcode')}</h2><div id="codeBox"></div></div>
  </div>
  <div class="grid" style="align-content:start">
   <div class="card"><h2>${t('stock')}</h2>
    <div class="row" style="margin-bottom:10px"><div class="seg" id="unitSeg"><button data-u="in" class="${S.units==='in'?'on':''}">inch</button><button data-u="mm" class="${S.units==='mm'?'on':''}">mm</button></div></div>
    <div class="fields">${inp('sx',fl(S.stock.x),'data-b="stock.x" data-u="L"')}${inp('sy',fl(S.stock.y),'data-b="stock.y" data-u="L"')}${inp('sz',fl(S.stock.z),'data-b="stock.z" data-u="L"')}${inp('face',fl(S.stock.face),'data-b="stock.face" data-u="L"')}${inp('partT',fl(S.stock.part),'data-b="stock.part" data-u="L"')}</div>
    <h3 style="margin-top:14px">${t('zero')}</h3><div class="seg" id="zeroSeg">${['ll','tl','lr','c'].map(k=>`<button data-z="${k}" class="${z===k?'on':''}">${t(k==='c'?'ctr':k)}</button>`).join('')}</div>
    <p class="sub" style="margin:8px 0 0;font-size:13.5px">${t('z0')}</p></div>
   <div class="card"><h2>${t('defs')}</h2>${(()=>{const D={...DEF0,...(S.def||{})};const L=(k,p)=>inp(k,fl(D[p]),`data-b="def.${p}" data-u="L"`);const sw=(k,p)=>`<label class="row" style="gap:8px;font-weight:600;font-size:14px;min-height:46px"><span class="sw"><input type="checkbox" data-defsw="${p}" ${D[p]?'checked':''}><i></i></span>${t(k)}</label>`;
    return`<div class="fields">${L('grip','grip')}${L('safety','safety')}${L('roughDoc','roughDoc')}${L('finLeave','finLeave')}${L('pocketDepth','pocketDepth')}
    <label class="f">${t('roughMethod')}<select data-b="def.roughMethod" data-u="S"><option value="contour" ${D.roughMethod==='contour'?'selected':''}>${t('byContour')}</option><option value="adaptive" ${D.roughMethod==='adaptive'?'selected':''}>${t('byAdaptive')}</option></select></label>
    <label class="f">${t('drillCycle')}<select data-b="def.drillCycle" data-u="S">${[['auto','Auto (G81/G83)'],['G81','G81'],['G82','G82'],['G83','G83'],['G73','G73']].map(([v,l])=>`<option value="${v}" ${D.drillCycle===v?'selected':''}>${l}</option>`).join('')}</select></label></div>
    <div class="row" style="margin-top:6px">${sw('stockAuto','stockAuto')}${sw('finFull','finFull')}</div>
    <p class="sub" style="margin:6px 0 0;font-size:13px"><span class="ro">${t('sz')} = ${fl(S.stock.part,3)} + ${fl(S.stock.face,3)} + ${fl(D.grip,3)} + ${fl(D.safety,3)} = <b>${fl(S.stock.part+S.stock.face+D.grip+D.safety,3)}</b></span> · ${t('axisNote')}</p>
    <button class="btn sm" style="margin-top:8px" data-act="auto">${IC.bolt}${t('autoProg')}</button>`;})()}</div>
   <div class="card"><div class="row" style="justify-content:space-between;margin-bottom:10px"><h2 style="margin:0">${t('ops')}</h2><div class="row"><button class="btn sm" data-act="auto">${IC.bolt}${t('autoProg')}</button><button class="btn sm" data-act="addOp">${IC.plus}</button></div></div><div class="ops" id="ops"></div></div>
  </div></div>`;
 renderOps();renderCode();initView();
}
function passTxt(o){const tot=Math.abs(o.zTop-o.zBot);const n=Math.max(1,Math.ceil(tot/Math.max(o.doc,1e-4)-1e-6));return n+' '+t('passes')+' × '+fl(tot/n,3);}
function renderOps(){
 const el=$('#ops');if(!el)return;
 el.innerHTML=S.ops.map((o,i)=>{const tl=toolById(o.tool),f=featById(o.feat),open=OPEN.has(o.id);const col=OPCOL[i%OPCOL.length];
  const lenF=(k,v)=>inp(k,fl(v),`data-op="${o.id}" data-k="${k}" data-u="L"`),feedF=(k,v)=>`<label class="f">${esc(t(k))} (${flab()})<input inputmode="decimal" data-op="${o.id}" data-k="${k}" data-u="F" value="${ffd(v)}"></label>`;
  const isMill=['face','adaptive','pocket','contour','slot','circ','surfRough','wrap','rest','flute'].includes(o.type);
  return`<div class="op ${o.on?'':'off'} ${open?'open':''}" data-id="${o.id}">
  <div class="oph" data-tog="${o.id}">${opIcon(o.type,col,i+1)}<span class="opt"><b>${esc(opLabel(o.type,o))}${o.a!=null?' · A'+o.a+'°':''}${o.b!=null?' · B'+o.b+'°':''}${o.c!=null?' · C'+o.c+'°':''}${o.cycle?' · '+o.cycle:''}</b><span>${esc(featLabel(f))} · T${tl?tl.num:'?'} ${esc(tl?tl.desc:'')} · <b>${o.rpm} rpm · F${ffd(o.feed)}${isMill&&o.type!=='face'?' · '+passTxt(o):''}${o.type==='contour'&&(o.leave||0)>0?' · +'+fl(o.leave,3):''}</b></span></span>
  <label class="sw"><input type="checkbox" data-on="${o.id}" ${o.on?'checked':''}><i></i></label></div>
  <div class="opb"><div class="fields">
   <label class="f">${t('type')}<select data-op="${o.id}" data-k="type">${OPTYPES.map(x=>`<option value="${x}" ${x===o.type?'selected':''}>${esc(opLabel(x))}</option>`).join('')}</select></label>
   ${o.type==='face'?'':`<label class="f">${t('feature')}<select data-op="${o.id}" data-k="feat">${S.feats.map(x=>`<option value="${x.id}" ${x.id===o.feat?'selected':''}>${esc(featLabel(x))}</option>`).join('')}</select></label>`}
   <label class="f">${t('tool')}<select data-op="${o.id}" data-k="tool">${S.tools.map(x=>`<option value="${x.id}" ${x.id===o.tool?'selected':''}>T${x.num} ${esc(x.desc)}</option>`).join('')}</select></label>
   ${lenF('zTop',o.zTop)}${o.type==='chamfer'?lenF('chamferSz',o.chamfer):o.type==='radius'?'':lenF('zBot',o.zBot)}
   ${isMill?lenF('doc',o.doc):''}${isMill&&o.type!=='contour'?lenF('woc',o.woc):''}${['adaptive','pocket','contour','circ'].includes(o.type)?lenF('leave',o.leave):''}
   ${o.type==='slot'?lenF('width',o.width||0):''}
   ${['drill','spot','bore'].includes(o.type)?`<label class="f">${t('cycle')}<select data-op="${o.id}" data-k="cycle" data-u="S">${({drill:[['','Auto'],['G81','G81 drill'],['G82','G82 dwell'],['G83','G83 peck'],['G73','G73 chip-break']],spot:[['G81','G81'],['G82','G82 dwell']],bore:[['G85','G85 feed out'],['G86','G86 stop+rapid']]})[o.type].map(([v,l])=>`<option value="${v}" ${(o.cycle||'')===v?'selected':''}>${l}</option>`).join('')}</select></label>`:''}
   ${o.type==='drill'&&(!o.cycle||o.cycle==='G83'||o.cycle==='G73')?lenF('peck',o.peck):''}${['G82','G86'].includes(o.cycle)?inp('dwell',o.dwell??0.2,`data-op="${o.id}" data-k="dwell" data-u="N"`):''}
   ${o.type==='contour'?inp('rings',o.rings||1,`data-op="${o.id}" data-k="rings" data-u="N"`)+((o.rings||1)>1?lenF('woc',o.woc):''):''}
   ${o.type==='surfFinish'||o.type==='surfRadial'||o.type==='vcarve'||o.type==='rest'?lenF('woc',o.woc):''}${o.type==='surfWater'?lenF('doc',o.doc):''}
   ${o.type==='pocket'?`<label class="f">${t('pattern')}<select data-op="${o.id}" data-k="pattern" data-u="S"><option value="offset" ${o.pattern!=='zigzag'?'selected':''}>${t('offsetP')}</option><option value="zigzag" ${o.pattern==='zigzag'?'selected':''}>${t('zigzagP')}</option></select></label>`:''}
   ${o.type==='rest'?lenF('refDia',o.refDia||0.5):''}${['surfScallop','surfMorph','rotFinish','flow5'].includes(o.type)?lenF('woc',o.woc):''}${['surfScallop','surfMorph','rotFinish','flow5'].includes(o.type)?lenF('leave',o.leave):''}
   ${o.type==='moulding'?`<label class="f">${t('prof')}<select data-op="${o.id}" data-k="prof" data-u="S">${[['cove','cove'],['round','round'],['ogee','ogee'],['v','vprof']].map(([v,k])=>`<option value="${v}" ${(o.prof||'cove')===v?'selected':''}>${t(k)}</option>`).join('')}</select></label>${lenF('pw',o.pw||0.75)}${lenF('pd',o.pd||0.25)}${lenF('woc',o.woc)}${lenF('doc',o.doc)}`:''}
   ${o.type==='flow5'?inp('lead5',o.lead5??5,`data-op="${o.id}" data-k="lead5" data-u="N"`)+inp('lean5',o.lean5??0,`data-op="${o.id}" data-k="lean5" data-u="N"`)+inp('maxTilt',o.maxTilt??60,`data-op="${o.id}" data-k="maxTilt" data-u="N"`):''}${o.type==='deburr5'?lenF('chamferSz',o.chamfer):''}${o.type==='flute'?lenF('rampLen',o.rampLen||0.5):''}${o.type.startsWith('surf')?lenF('leave',o.leave):''}
   ${o.type==='wrap'?lenF('wrapD',o.wrapD):''}${o.type==='rotRough'?lenF('d0',o.d0)+lenF('d1',o.d1)+lenF('x0',o.x0)+lenF('x1',o.x1)+lenF('woc',o.woc)+lenF('doc',o.doc):''}${o.type==='swarf'?inp('tilt',o.tilt,`data-op="${o.id}" data-k="tilt" data-u="N"`):''}
   ${axesAvail()>=4&&!MULTI.includes(o.type)?inp('aAng',o.a??'',`data-op="${o.id}" data-k="a" data-u="N" placeholder="—"`):''}
   ${axesAvail()>=5&&!MULTI.includes(o.type)?inp('bAng',o.b??'',`data-op="${o.id}" data-k="b" data-u="N" placeholder="—"`)+inp('cAng',o.c??'',`data-op="${o.id}" data-k="c" data-u="N" placeholder="—"`):''}
   ${axesAvail()>=4?`<label class="f">${t('wcs')}<select data-op="${o.id}" data-k="wcs" data-u="S">${['','G54','G55','G56','G57','G58','G59'].map(w=>`<option ${(o.wcs||'')===w?'selected':''} value="${w}">${w||'—'}</option>`).join('')}</select></label>`:''}
   ${['adaptive','pocket'].includes(o.type)?`<label class="f">${t('entry')}<select data-op="${o.id}" data-k="entry" data-u="S">${[['helix','helix'],['ramp','rampE'],['plunge','plungeE']].map(([v,k])=>`<option value="${v}" ${(o.entry||'ramp')===v?'selected':''}>${t(k)}</option>`).join('')}</select></label>`:''}
   ${['contour','chamfer','radius'].includes(o.type)?`<label class="f">${t('lead')}<select data-op="${o.id}" data-k="lead" data-u="S">${[['arc','leadArc'],['line','leadLine'],['none','leadNone']].map(([v,k])=>`<option value="${v}" ${(o.lead||'arc')===v?'selected':''}>${t(k)}</option>`).join('')}</select></label>${lenF('leadR',o.leadR||tl&&tl.dia*0.3||0.1)}`:''}
   ${['adaptive','pocket','contour'].includes(o.type)?inp('corner',Math.round((o.corner==null?0.6:o.corner)*100),`data-op="${o.id}" data-k="corner" data-u="P"`):''}
   ${['adaptive','pocket','slot','circ'].includes(o.type)?inp('ramp',o.ramp,`data-op="${o.id}" data-k="ramp" data-u="N"`):''}
   ${inp('rpm',o.rpm,`data-op="${o.id}" data-k="rpm" data-u="N"`)}${feedF('feed',o.feed)}${['drill','spot','tap','ream','bore'].includes(o.type)?'':feedF('plunge',o.plunge)}
  </div>
  <div class="row" style="margin-top:10px;justify-content:space-between"><label class="row" style="gap:8px;font-weight:600;font-size:14px"><span class="sw"><input type="checkbox" data-auto="${o.id}" ${o.auto?'checked':''}><i></i></span>${t('autoFeeds')}</label>
  <div class="row"><button class="mini" data-mv="${o.id}" data-d="-1" aria-label="${t('up')}">${IC.up}</button><button class="mini" data-mv="${o.id}" data-d="1" aria-label="${t('down')}">${IC.down}</button><button class="mini" data-del="${o.id}" aria-label="${t('del')}" style="color:var(--bad)">${IC.del}</button></div></div>
  ${o.note?`<p class="sub" style="margin:8px 0 0;font-size:13px">${esc(o.note)}</p>`:''}</div></div>`;}).join('')||`<p class="sub">—</p>`;
}
function hlG(s){return esc(s).split('\n').map(l=>l.replace(/(\(.*\))/,'<span class="c">$1</span>').replace(/\b(G0?[0-3]|G8[0-9]|G43|G9[089])\b/g,'<span class="g">$1</span>').replace(/\b(M0?[0-9]+|T\d+)\b/g,'<span class="m">$1</span>')).join('\n');}
function renderCode(){
 const el=$('#codeBox');if(!el)return;if(!PROG||!PROG.length){el.innerHTML=`<p class="sub">${t('noPart')}</p>`;return;}
 const n=GCODE.split('\n').length,mm=Math.floor(CT/60),ss=Math.round(CT%60);
 el.innerHTML=`<div class="kpi" style="margin-bottom:10px"><div><span>${t('cycle')}</span><b>${mm}:${String(ss).padStart(2,'0')}</b></div><div><span>${t('lines')}</span><b>${n}</b></div><div><span>${t('toolsUsed')}</span><b>${PROG.filter(b=>b.t==='tool').length}</b></div></div>
 ${WARN.length?`<div class="warn" style="margin-bottom:10px">${WARN.map(esc).join('<br>')}</div>`:''}
 <div class="row" style="margin-bottom:10px"><button class="btn go" data-act="saveG">${IC.save}${t('saveFile')}</button><label class="chip">${t('fileType')} <select id="extSel">${['gcd','cam','nc','ncc','tap','mpf','txt'].map(x=>`<option ${(S.ext||'gcd')===x?'selected':''}>${x}</option>`).join('')}</select></label><button class="btn" data-act="copyG">${IC.copy}${t('copy')}</button></div>
 <div class="row" style="margin-bottom:10px">
  <label class="chip">${t('post')} <select id="postSel"><option value="prototrak" ${S.post==='prototrak'?'selected':''}>ProtoTRAK RMX/KMX/SMX</option><option value="haas" ${S.post==='haas'?'selected':''}>Haas NGC</option><option value="fanuc" ${S.post==='fanuc'?'selected':''}>Fanuc</option><option value="siemens" ${S.post==='siemens'?'selected':''}>Siemens 840D</option></select></label>
  ${mach().rot?`<label class="chip">${t('rotary')} <select id="rotSel">${C.ROTARIES.map(r=>`<option value="${r.id}" ${(S.rotary||'none')===r.id?'selected':''}>${esc(r.name)}</option>`).join('')}</select></label>`:''}
  <label class="row" style="gap:6px;font-size:14px;font-weight:600"><span class="sw"><input type="checkbox" id="tsChk" ${S.toolStop?'checked':''}><i></i></span>M00</label>
  <label class="row" style="gap:6px;font-size:14px;font-weight:600"><span class="sw"><input type="checkbox" id="lnChk" ${S.lineNums?'checked':''}><i></i></span>N#</label></div>
 <pre class="code">${hlG(GCODE.length>60000?GCODE.slice(0,60000)+'\n( … )':GCODE)}</pre>
 <p class="sub" style="margin:8px 0 0;font-size:13px">${t('gcdHint')} ${t('verify')}</p>`;
}

/* ----- 2D part view ----- */
const VIEW={sc:80,ox:0,oy:0,paths:true,fitted:false,mode:'2d',yaw:-0.6,pitch:0.9,z3:1};let MODEL=null;
function initView(){const cv=$('#pvc');if(!cv)return;const ro=new ResizeObserver(()=>{if(!VIEW.fitted)fitView();drawView();});ro.observe(cv);VIEW.ro=ro;
 const pts=new Map();let last=null;
 cv.addEventListener('pointerdown',e=>{cv.setPointerCapture(e.pointerId);pts.set(e.pointerId,[e.clientX,e.clientY]);});
 cv.addEventListener('pointermove',e=>{if(!pts.has(e.pointerId))return;const p=pts.get(e.pointerId);
  if(pts.size===1){if(VIEW.mode==='3d'){VIEW.yaw+=(e.clientX-p[0])*0.008;VIEW.pitch=Math.max(0.05,Math.min(1.45,VIEW.pitch+(e.clientY-p[1])*0.006));}else{VIEW.ox+=e.clientX-p[0];VIEW.oy+=e.clientY-p[1];}}
  else if(pts.size===2&&SETS().viewZoom){const o=[...pts.entries()].find(([k])=>k!==e.pointerId)[1];const d0=Math.hypot(p[0]-o[0],p[1]-o[1]),d1=Math.hypot(e.clientX-o[0],e.clientY-o[1]);if(d0>0){if(VIEW.mode==='3d')VIEW.z3=Math.max(0.3,Math.min(8,VIEW.z3*d1/d0));else zoomAt((e.clientX+o[0])/2,(e.clientY+o[1])/2,d1/d0);}}
  pts.set(e.pointerId,[e.clientX,e.clientY]);drawView();});
 const up=e=>pts.delete(e.pointerId);cv.addEventListener('pointerup',up);cv.addEventListener('pointercancel',up);
 cv.addEventListener('wheel',e=>{e.preventDefault();if(!SETS().viewZoom)return;if(VIEW.mode==='3d')VIEW.z3*=e.deltaY<0?1.1:0.9;else zoomAt(e.clientX,e.clientY,e.deltaY<0?1.15:1/1.15);drawView();},{passive:false});
 cv.addEventListener('dblclick',()=>{fitView();drawView();});}
function zoomAt(cx,cy,f){const r=$('#pvc').getBoundingClientRect(),x=cx-r.left,y=cy-r.top;VIEW.ox=x-(x-VIEW.ox)*f;VIEW.oy=y-(y-VIEW.oy)*f;VIEW.sc*=f;}
function fitView(){const cv=$('#pvc');if(!cv)return;const W=cv.clientWidth,H=cv.clientHeight;const sr=stockRect();const w=sr[2]-sr[0],h=sr[3]-sr[1];if(!W||!H)return;VIEW.sc=Math.min(W/(w*1.25),H/(h*1.25));VIEW.ox=W/2-(sr[0]+sr[2])/2*VIEW.sc;VIEW.oy=H/2+(sr[1]+sr[3])/2*VIEW.sc;VIEW.fitted=true;}
function cssv(n){return getComputedStyle(document.documentElement).getPropertyValue(n).trim();}
function drawView(){
 const cv=$('#pvc');if(!cv)return;if(VIEW.mode==='3d'&&S.geom){drawModel3D(cv);return;}const dpr=devicePixelRatio||1,W=cv.clientWidth,H=cv.clientHeight;cv.width=W*dpr;cv.height=H*dpr;const g=cv.getContext('2d');g.setTransform(dpr,0,0,dpr,0,0);g.clearRect(0,0,W,H);
 const X=x=>VIEW.ox+x*VIEW.sc,Y=y=>VIEW.oy-y*VIEW.sc;const dark=matchMedia('(prefers-color-scheme: dark)').matches&&document.documentElement.dataset.theme!=='light'||document.documentElement.dataset.theme==='dark';
 // grid
 g.strokeStyle=dark?'rgba(255,255,255,.05)':'rgba(0,0,0,.05)';g.lineWidth=1;const step=S.units==='mm'?10/25.4:0.25;const gs=step*VIEW.sc;if(gs>6){g.beginPath();for(let x=VIEW.ox%gs;x<W;x+=gs){g.moveTo(x,0);g.lineTo(x,H);}for(let y=VIEW.oy%gs;y<H;y+=gs){g.moveTo(0,y);g.lineTo(W,y);}g.stroke();}
 if(!S.geom){$('#pvInfo')&&($('#pvInfo').textContent='');return;}
 const sr=stockRect();g.fillStyle=dark?'rgba(180,190,200,.10)':'rgba(140,150,160,.12)';g.strokeStyle=dark?'#56606a':'#9aa3ab';g.setLineDash([6,4]);g.fillRect(X(sr[0]),Y(sr[3]),(sr[2]-sr[0])*VIEW.sc,(sr[3]-sr[1])*VIEW.sc);g.strokeRect(X(sr[0]),Y(sr[3]),(sr[2]-sr[0])*VIEW.sc,(sr[3]-sr[1])*VIEW.sc);g.setLineDash([]);
 const path=p=>{g.moveTo(X(p[0][0]),Y(p[0][1]));for(let i=1;i<p.length;i++)g.lineTo(X(p[i][0]),Y(p[i][1]));g.closePath();};
 for(const f of S.feats)if(f.kind==='profile'){g.beginPath();path(f.loop);g.fillStyle='rgba(36,87,214,.22)';g.fill();g.strokeStyle='#2457d6';g.lineWidth=2;g.stroke();}
 for(const f of S.feats){if(f.kind==='pocket'){g.beginPath();path(f.loop);(f.islands||[]).forEach(path);g.fillStyle=dark?'#1f2429':'#f6f7f8';g.fill('evenodd');g.strokeStyle='#7a4fd6';g.lineWidth=2;g.stroke();}
  if(f.kind==='holes'){g.strokeStyle='#1c9b5f';g.lineWidth=2;for(const p of f.pts){g.beginPath();g.arc(X(p[0]),Y(p[1]),f.dia/2*VIEW.sc,0,7);g.fillStyle=dark?'#1f2429':'#f6f7f8';g.fill();g.stroke();}}
  if(f.kind==='slot'){g.beginPath();g.moveTo(X(f.path[0][0]),Y(f.path[0][1]));f.path.forEach(q=>g.lineTo(X(q[0]),Y(q[1])));g.strokeStyle='#ff6a13';g.lineWidth=2.5;g.stroke();}}
 if(VIEW.paths&&SEGS.length){g.lineWidth=1;let cur=-2;for(const s of SEGS){if(s[6]===0){continue;}if(s[9]!==cur){if(cur!==-2)g.stroke();cur=s[9];g.beginPath();g.strokeStyle=OPCOL[(cur<0?0:cur)%OPCOL.length];g.globalAlpha=.8;}g.moveTo(X(s[0]),Y(s[1]));g.lineTo(X(s[3]),Y(s[4]));}g.stroke();
  g.globalAlpha=.55;g.setLineDash([3,3]);g.strokeStyle='#d93a3a';g.beginPath();for(const s of SEGS)if(s[6]===0&&(s[0]!==s[3]||s[1]!==s[4])){g.moveTo(X(s[0]),Y(s[1]));g.lineTo(X(s[3]),Y(s[4]));}g.stroke();g.setLineDash([]);g.globalAlpha=1;}
 // zero
 const zx=X(0),zy=Y(0),zr=9;g.fillStyle='#fff';g.strokeStyle='#111';g.lineWidth=1.5;g.beginPath();g.arc(zx,zy,zr,0,7);g.fill();g.stroke();g.fillStyle='#111';g.beginPath();g.moveTo(zx,zy);g.arc(zx,zy,zr,-Math.PI/2,0);g.fill();g.beginPath();g.moveTo(zx,zy);g.arc(zx,zy,zr,Math.PI/2,Math.PI);g.fill();
 g.strokeStyle='#d93a3a';g.lineWidth=2;g.beginPath();g.moveTo(zx+zr,zy);g.lineTo(zx+40,zy);g.moveTo(zx,zy-zr);g.lineTo(zx,zy-40);g.stroke();g.fillStyle='#d93a3a';g.font='700 12px Barlow';g.fillText('X',zx+43,zy+4);g.fillText('Y',zx-4,zy-44);
 const info=$('#pvInfo');if(info)info.textContent=fl(sr[2]-sr[0],3)+' × '+fl(sr[3]-sr[1],3)+' × '+fl(S.stock.z,3)+' '+ulab();
}

/* ----- tools tab ----- */
function rTools(){
 $('#main').innerHTML=`<h1>${t('toolsTitle')}</h1><p class="sub">${t('toolsSub')}</p>
 <div class="row" style="margin-bottom:14px"><button class="btn pri" data-act="addTool">${IC.plus}${t('addTool')}</button><button class="btn" data-act="importJson">${IC.file}${t('importJson')}</button><button class="btn" data-act="exportJson">${IC.copy}${t('exportJson')}</button></div>
 ${(()=>{L0();return`<h2 style="margin:6px 0 10px">${t('ltools')}</h2><div class="tools" style="margin-bottom:18px">${S.ltools.map((x,i)=>`<div class="tcard"><div class="pic" style="height:110px">${lToolSVG(x,true)}</div><span class="tnum">T${x.num}</span><input class="inp" data-lt="${i}" data-k="desc" data-u="S" value="${esc(x.desc)}"><span style="font-size:12.5px;line-height:1.4;opacity:.8">💡 ${esc(twhy(x.type))}</span>${x.type==='turn'||x.type==='bore'?`<div class="row"><select class="inp" style="flex:1" data-lt="${i}" data-k="insert" data-u="S">${['CNMG','DNMG','VNMG','TNMG','WNMG','CCMT','DCMT','VCMT'].map(k=>`<option ${x.insert===k?'selected':''}>${k}</option>`).join('')}</select></div>`:''}</div>`).join('')}</div><h2 style="margin:6px 0 10px">${LANG==='vi'?'Dao phay':'Milling tools'}</h2>`;})()}
 <div class="tools">${S.tools.slice().sort((a,b)=>a.num-b.num).map(x=>{const used=S.ops.some(o=>o.on&&o.tool===x.id);return`<button class="tcard" data-tool="${x.id}"><div class="pic">${toolSVG(x)}</div><span class="tnum" style="${used?'':'background:var(--mut)'}">T${x.num}</span><b>${esc(x.desc)}</b><span>Ø${fl(x.dia)} ${ulab()} · ${x.flutes}FL · ${x.mat==='hss'?'HSS':'Carbide'}${x.coat&&x.coat!=='none'?' · '+esc(x.coat):''}</span><span style="font-size:12.5px;line-height:1.4;color:var(--ink);opacity:.8;text-align:left">💡 ${esc(twhy(x.type))}</span>${used?`<span style="font-size:12px;color:#1c9b5f;font-weight:700;text-align:left">${LANG==='vi'?'Dùng cho: ':'Used for: '}${esc(tUsedBy(x.id).join(', '))}</span>`:''}</button>`;}).join('')}</div>`;
}
const TWHY={flat:['Flat end mill — the workhorse: pockets, walls, slots, adaptive roughing. Sharp corner leaves a square floor.','Dao phay đầu bằng — dao chính: hốc, vách, rãnh, phá thô adaptive. Góc vuông nên đáy và góc hốc vuông.'],
 ball:['Ball end mill — 3D curved surfaces and fillets. Not for flat floors (center has zero speed).','Dao cầu — bề mặt cong 3D và góc bo. Không dùng cho đáy phẳng (tâm dao tốc độ bằng 0).'],
 bull:['Bull nose (corner radius) — strong edge for roughing steel and 3D roughing; leaves a small fillet on the floor.','Dao bo góc — mép cắt khoẻ, phá thô thép và phá thô 3D; để lại góc bo nhỏ ở đáy.'],
 face:['Face mill — large diameter, flattens the top fast and makes it your Z0.','Dao phay mặt — đường kính lớn, làm phẳng mặt trên nhanh, tạo chuẩn Z0.'],
 drill:['Drill — makes round holes fast. Spot first; peck (G83) when deeper than 3× diameter.','Mũi khoan — khoan lỗ tròn nhanh. Khoan mồi trước; khoan mổ (G83) khi sâu hơn 3 lần đường kính.'],
 spot:['Spot drill — makes a small cone so the drill starts exactly on position and does not walk. Also small chamfers.','Mũi khoan mồi — tạo lỗ côn nhỏ để mũi khoan vào đúng vị trí, không bị trượt. Cũng vát mép nhỏ.'],
 chamfer:['Chamfer mill — breaks sharp edges (deburr) and makes 45° chamfers on edges and holes.','Dao vát mép — làm cùn cạnh sắc (bavia) và vát 45° ở cạnh và miệng lỗ.'],
 tap:['Tap — cuts threads in a drilled hole (G84). Use the tap-drill chart for the hole size.','Mũi taro — cắt ren trong lỗ đã khoan (G84). Tra bảng mũi khoan taro để chọn lỗ.'],
 reamer:['Reamer — finishes a hole to an exact size (±.0005) and smooth wall. Drill .010–.015 under first.','Mũi doa — làm lỗ đúng kích thước chính xác (±.0005) và trơn. Khoan nhỏ hơn .010–.015 trước.'],
 boring:['Boring head/bar — adjusts to any hole size, fixes position and roundness; best for tight big holes.','Đầu móc lỗ / cây móc — chỉnh được mọi cỡ lỗ, sửa vị trí và độ tròn; tốt cho lỗ lớn dung sai chặt.'],
 cornerround:['Corner rounding mill — makes a radius on outside edges instead of a chamfer.','Dao bo cạnh — tạo góc bo tròn ở cạnh ngoài thay vì vát mép.'],
 turn:['Turning insert — OD facing, roughing (80° C) and finishing/profiling (35° V).','Mảnh tiện ngoài — tiện mặt, tiện thô (80° C) và tiện tinh/biên dạng (35° V).'],
 groove:['Grooving insert — O-ring and snap-ring grooves, plunge straight in X.','Mảnh tiện rãnh — rãnh gioăng O-ring, rãnh phe, ăn thẳng theo X.'],
 thread:['Threading insert — 60° threads with G76/G32, many light passes.','Mảnh tiện ren — ren 60° bằng G76/G32, nhiều lượt nhẹ.'],
 part:['Part-off blade — cuts the finished part from the bar; slow the feed near center.','Dao cắt đứt — cắt chi tiết khỏi phôi thanh; giảm feed khi gần tâm.'],
 bore:['Boring bar — opens and finishes inside diameters (ID).','Dao tiện lỗ — mở rộng và tiện tinh lỗ trong (ID).']};
const twhy=(type)=>{const w=TWHY[type];return w?(LANG==='vi'?w[1]:w[0]):'';};
const tUsedBy=(id)=>S.ops.filter(o=>o.on&&o.tool===id).map(o=>opLabel(o.type)).filter((v,i,a)=>a.indexOf(v)===i);
function editTool(id){
 const x=toolById(id);if(!x)return;const L=(k,v)=>inp(k,fl(v),`data-tl="${id}" data-k="${k}" data-u="L"`),N=(k,v)=>inp(k,v??'',`data-tl="${id}" data-k="${k}" data-u="N"`);
 const types=['flat','ball','bull','face','drill','spot','chamfer','tap','reamer','boring','cornerround'];
 openSheet(`<div class="grab"></div><div class="grid g2b grid" style="grid-template-columns:minmax(0,1fr)"><div class="big" style="height:260px;display:grid;place-items:center;color:var(--ink)" id="tlPic">${toolSVG(x,{dims:true})}</div>
 <div class="card" style="--cc:#ff6a13;margin:0 0 10px"><b>${LANG==='vi'?'Tại sao dùng dao này?':'Why use this tool?'}</b><p style="margin:6px 0 0;line-height:1.5">${esc(twhy(x.type))}</p>${tUsedBy(x.id).length?`<p class="sub" style="margin:6px 0 0">${LANG==='vi'?'Đang dùng cho: ':'Used for: '}${esc(tUsedBy(x.id).join(', '))}</p>`:''}${(()=>{const m=mat(),hard=['ss304','ss316','ss174','in718','ti64','s4140','a2','s4340'].includes(m.id);const soft=['al6061','al7075','al2024','al5052','mic6','delrin','brass','cu110','brz932'].includes(m.id);const tip=soft?(LANG==='vi'?'Vật liệu mềm: dao 2–3 me, không phủ / ZrN, bóng me.':'Soft material: 2–3 flutes, uncoated / ZrN, polished flutes.'):hard?(LANG==='vi'?'Vật liệu cứng/dai: carbide 4–5 me phủ AlTiN, dao ngắn, nhiều nước làm mát.':'Hard/tough material: carbide 4–5 flutes AlTiN, short stick-out, lots of coolant.'):(LANG==='vi'?'Thép thường: carbide 4 me phủ TiAlN.':'Steel: carbide 4 flutes TiAlN.');return`<p class="sub" style="margin:6px 0 0">${esc((LANG==='vi'?m.vi:m.en)+': '+tip)}</p>`;})()}</div>
 <div class="fields">${N('num',x.num)}<label class="f">${t('type')}<select data-tl="${id}" data-k="type">${types.map(k=>`<option ${k===x.type?'selected':''}>${k}</option>`).join('')}</select></label>
 <label class="f" style="grid-column:1/-1">${t('desc')}<input data-tl="${id}" data-k="desc" data-u="S" value="${esc(x.desc)}"></label>
 ${L('dia',x.dia)}${N('flutes',x.flutes)}<label class="f">${t('tmat')}<select data-tl="${id}" data-k="mat"><option value="carbide" ${x.mat!=='hss'?'selected':''}>Carbide</option><option value="hss" ${x.mat==='hss'?'selected':''}>HSS / Cobalt</option></select></label>
 <label class="f">${t('coat')}<select data-tl="${id}" data-k="coat">${Object.keys(COATS).filter(k=>k!=='hss').map(k=>`<option ${k===(x.coat||'none')?'selected':''}>${k}</option>`).join('')}</select></label>
 ${L('loc',x.loc)}${L('oal',x.oal)}${['bull','cornerround'].includes(x.type)?L('cornerR',x.cornerR):''}${['drill','spot','chamfer'].includes(x.type)?N('tipAngle',x.tipAngle):''}${['chamfer','cornerround'].includes(x.type)?L('tipDia',x.tipDia):''}${x.type==='tap'?L('pitch',x.pitch):''}</div>
 <div class="row" style="justify-content:space-between"><button class="btn" data-deltool="${id}" style="color:var(--bad)">${IC.del}${t('del')}</button><button class="btn pri" data-act="closeSheet">${t('save')}</button></div></div>`);
}
function openSheet(h){$('#sheetBody').innerHTML=h;$('#sheet').classList.add('on');}
function closeSheet(){$('#sheet').classList.remove('on');if(S.tab==='tools')rTools();}

/* ----- fixtures tab ----- */
function rFixtures(){
 const fx=S.fixture,types=['vise','softjaw','clamps','plate','collet','angle'];const fc=fixtureCheck();
 $('#main').innerHTML=`<h1>${t('fixTitle')}</h1><p class="sub">${t('fixSub')}</p>
 <div class="fixgrid" style="margin-bottom:14px">${types.map(k=>`<button class="fx ${fx.type===k?'on':''}" data-fx="${k}">${fixtureSVG(k,true)}${t(k)}</button>`).join('')}</div>
 <div class="grid g2"><div class="card big">${fixtureSVG(fx.type)}
  ${fc?`<div class="kpi" style="margin-top:10px"><div><span>${t('stickout')}</span><b>${fl(fc.so,3)}</b></div><div><span>${t('deep')}</span><b style="color:${fc.bad?'var(--bad)':'inherit'}">${fl(fc.deep,3)}</b></div></div>
  <p class="${fc.bad?'':'ok'}" style="font-weight:600;margin:10px 0 0;${fc.bad?'color:var(--bad)':''}">${fc.bad?t('fixBad'):t('fixOk')}${fc.low?' · '+t('fixLow'):''}</p>`:''}</div>
  <div class="grid" style="align-content:start"><div class="card"><div class="fields">${inp('viseSize',fl(fx.vise),'data-b="fixture.vise" data-u="L"')}${inp('jawH',fl(fx.jawH),'data-b="fixture.jawH" data-u="L"')}${inp('parH',fl(fx.parH),'data-b="fixture.parH" data-u="L"')}<label class="row" style="gap:8px;font-weight:600;font-size:14px;align-self:end;min-height:46px"><span class="sw"><input type="checkbox" id="parAuto" ${fx.parAuto?'checked':''}><i></i></span>${t('parAuto')}</label>
  ${inp('sz',fl(S.stock.z),'data-b="stock.z" data-u="L"')}</div>
  <label class="f" style="margin-top:10px">${t('notes')}<textarea data-b="fixture.notes" data-u="S">${esc(fx.notes)}</textarea></label></div>
  <div class="card"><h3>${t('zero')}</h3>${partSVG({mh:280})||`<p class="sub">${t('noPart')}</p>`}</div></div></div>`;
}

/* ----- simulator ----- */
const SIMSTATE={sh:{path:1,all:0,rapid:0,tool:1,fix:1,cube:1},stopAt:null,stopEach:0,axis:'3',dirty:true,playing:false,mode:'3d',yaw:-0.6,pitch:0.95,zoom:1,speed:2.5,color:'op',hd:false};
const TOOLCOL=['#e8590c','#2457d6','#1c9b5f','#a347d1','#d93a3a','#0aa3b5','#c48a00','#5c6bc0','#e0457b','#3d8b37','#7a5c3e','#00897b'];
let SIM=null;
function toolKernel(tl,res){const r=Math.max(tl.dia/2,tl.type==='cornerround'?(tl.tipDia||0.1)/2+(tl.cornerR||0.06):0),n=Math.ceil(r/res),K=[];const ha=(tl.tipAngle||118)/2*Math.PI/180;
 for(let j=-n;j<=n;j++)for(let i=-n;i<=n;i++){const d=Math.hypot(i,j)*res;if(d>r+res*0.3)continue;const dd=Math.min(d,r);let z=0;
  switch(tl.type){case'ball':z=r-Math.sqrt(Math.max(0,r*r-dd*dd));break;case'bull':{const c=tl.cornerR||0.03;z=dd>r-c?c-Math.sqrt(Math.max(0,c*c-(dd-(r-c))**2)):0;break;}
   case'drill':case'spot':z=dd/Math.tan(ha);break;case'chamfer':{const tr=(tl.tipDia||0)/2;z=dd>tr?(dd-tr)/Math.tan(ha):0;break;}
   case'cornerround':{const tr=(tl.tipDia||0.1)/2,c=tl.cornerR||0.06;z=dd<=tr?0:Math.sqrt(Math.max(0,c*c-(tr+c-dd)**2));break;}
   default:z=0;}
  K.push(j,i,z);}return{K,r};}
function simInit(){if(SIMSTATE.axis==='4'){sim4Init();return;}
 const sr=stockRect(),W=sr[2]-sr[0],H=sr[3]-sr[1],res=Math.max(W,H)/(SIMSTATE.hd?440:280),nx=Math.ceil(W/res)+1,ny=Math.ceil(H/res)+1;
 const top=S.stock.face,bot=S.stock.face-S.stock.z;const h=new Float32Array(nx*ny).fill(top);
 SIM={sr,res,nx,ny,h,own:new Int16Array(nx*ny).fill(-1),top,bot,i:0,u:0,ker:{},crash:[],pos:[0,0,1],done:false,op:-1};SIMSTATE.dirty=false;
}
function stampAt(x,y,z,ti,rapid,oi){const tl=S.tools[ti];if(!tl)return;let k=SIM.ker[ti];if(!k)k=SIM.ker[ti]=toolKernel(tl,SIM.res);if(z>SIM.top+0.0001)return;
 const ci=Math.round((x-SIM.sr[0])/SIM.res),cj=Math.round((y-SIM.sr[1])/SIM.res),K=k.K,nx=SIM.nx,ny=SIM.ny,h=SIM.h;
 for(let q=0;q<K.length;q+=3){const j=cj+K[q],i=ci+K[q+1];if(i<0||j<0||i>=nx||j>=ny)continue;const zz=z+K[q+2],id=j*nx+i;if(zz<h[id]){if(rapid){if(h[id]-zz>0.002){SIM.crash.push([x,y,z]);return;}}else{h[id]=zz;SIM.own[id]=oi;}}}}
function simAdvance(dist){if(SIMSTATE.axis==='4'){sim4Advance(dist);return;} // walk along segments by distance (inch)
 let left=dist;const lim=SIM.limit!=null?SIM.limit:CS().length;while(left>0&&SIM.i<lim){const s=CS()[SIM.i];const L=Math.hypot(s[3]-s[0],s[4]-s[1],s[5]-s[2]);const rem=L*(1-SIM.u);const take=Math.min(rem,left);const u0=SIM.u,u1=L>0?SIM.u+take/L:1;
  const n=Math.max(1,Math.ceil(take/(SIM.res*0.5)));for(let k=1;k<=n;k++){const u=u0+(u1-u0)*k/n;const x=s[0]+(s[3]-s[0])*u,y=s[1]+(s[4]-s[1])*u,z=s[2]+(s[5]-s[2])*u;if(s.length>10&&s[6]!==0)stamp5(x,y,z,s[10],s[11],s[12],s[7],s[9]);else stampAt(x,y,z,s[7],s[6]===0,s[9]);SIM.pos=[x,y,z];}
  left-=take;SIM.u=u1;if(SIM.u>=1-1e-9){SIM.i++;SIM.u=0;}if(s[6]===0)left-=0;}
 if(SIM.i>=CS().length)SIM.done=true;}
function rSim(){if(mach().type==='lathe'){rLatheSim();return;}
 if(!SEGS.length&&SEGS4.length)SIMSTATE.axis='4';if(!SEGS4.length)SIMSTATE.axis='3';
 if(!CS().length){$('#main').innerHTML=`<h1>${t('simTitle')}</h1><p class="sub">${t('noProg')}</p><button class="btn pri" data-tab="program">${t('program')}</button>`;return;}
 $('#main').innerHTML=`<h1>${t('simTitle')}</h1>
 <div class="view" id="sv" style="height:min(62vh,600px)"><canvas id="svc"></canvas>
  <div class="ovl tl"><div class="seg" id="simMode"><button data-m="3d" class="${SIMSTATE.mode==='3d'?'on':''}">${t('view3d')}</button><button data-m="top" class="${SIMSTATE.mode==='top'?'on':''}">${t('viewTop')}</button></div><button class="btn sm ${SIMSTATE.hd?'pri':''}" data-act="simHD">${t('hd')}</button>${SEGS.length&&SEGS4.length?`<div class="seg"><button data-ax="3" class="${SIMSTATE.axis==='3'?'on':''}">XYZ</button><button data-ax="4" class="${SIMSTATE.axis==='4'?'on':''}">A</button></div>`:''}</div>
  <div class="ovl tr" style="flex-direction:column;align-items:flex-end;gap:6px"><div class="row" style="gap:6px"><button class="mini" data-zm="1.2">${IC.plus}</button><button class="mini" data-zm="0.83"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M5 12h14"/></svg></button></div></div><div id="vcube" style="position:absolute;right:16px;top:62px;z-index:3;width:124px;height:124px;${SIMSTATE.sh.cube?'':'display:none'}"><canvas id="vcc" style="position:absolute;inset:0;width:124px;height:124px;touch-action:none"></canvas>${[['up','50%','0','▲'],['dn','50%','100%','▼'],['lf','0','50%','◀'],['rt','100%','50%','▶'],['ccw','6%','8%','↶'],['cw','94%','8%','↷']].map(a=>`<button data-vca="${a[0]}" style="position:absolute;left:${a[1]};top:${a[2]};transform:translate(-50%,${a[2]==='0'?'0':a[2]==='100%'?'-100%':'-50%'});width:26px;height:26px;border:0;border-radius:8px;background:color-mix(in srgb,var(--panel) 75%,transparent);color:var(--mut);font-size:13px;padding:0;cursor:pointer">${a[3]}</button>`).join('')}<button data-vca="fit" style="position:absolute;right:-2px;bottom:-4px;border:0;border-radius:8px;background:var(--panel);font:700 11px Barlow,sans-serif;padding:4px 6px;box-shadow:0 1px 3px #0003;cursor:pointer">FIT</button><button data-vca="home" title="ISO" style="position:absolute;left:-2px;bottom:-4px;border:0;border-radius:8px;background:var(--panel);font-size:13px;padding:3px 6px;box-shadow:0 1px 3px #0003;cursor:pointer">⌂</button></div>
  <div class="ovl bl"><span class="pill" id="simInfo"></span></div><div class="ovl br"><span class="pill" id="simCrash" style="display:none;color:var(--bad)">${t('crash')}</span></div></div>
 <div class="card" style="margin-top:12px"><div class="row"><button class="btn go" id="simPlay" style="min-width:120px">${IC.play}${t('play')}</button><button class="btn" data-act="simReset">${IC.reset}${t('reset')}</button><button class="btn" data-act="simNext">${IC.next}${t('next')}</button>
  <label class="f" style="flex:1;min-width:160px">${t('speed')}<input type="range" id="simSpeed" min="0" max="6" step="0.1" value="${SIMSTATE.speed}"></label></div>
  <input type="range" id="simScrub" min="0" max="${CS().length}" value="0" style="margin-top:6px">
  <div class="row" style="margin-top:6px"><span style="font-weight:600;font-size:14px">${t('colorBy')}</span><div class="seg" id="simColor">${[['op','byOp'],['tool','byTool'],['depth','byDepth']].map(([v,k])=>`<button data-sc="${v}" class="${SIMSTATE.color===v?'on':''}">${t(k)}</button>`).join('')}</div></div>
  <div class="row" style="margin-top:8px;gap:6px">${[['path',LANG==='vi'?'Đường dao':'Toolpath','#2457d6'],['all',LANG==='vi'?'Toàn bộ':'Whole path','#5c6bc0'],['rapid',LANG==='vi'?'Chạy nhanh G0':'Rapids G0','#d93a3a'],['tool',LANG==='vi'?'Dao':'Tool','#ff6a13'],['fix',LANG==='vi'?'Đồ gá':'Fixture','#1c9b5f'],['cube',LANG==='vi'?'Khối xoay':'View cube','#6b737a']].map(k=>`<button class="chip" data-shw="${k[0]}" style="${SIMSTATE.sh[k[0]]?`background:${k[2]};color:#fff;border-color:${k[2]}`:''}">${SIMSTATE.sh[k[0]]?'✓ ':''}${k[1]}</button>`).join('')}</div>
  <div class="row" style="margin-top:8px;gap:6px"><button class="chip" data-act="simEach" style="${SIMSTATE.stopEach?'background:#8b4fd6;color:#fff;border-color:#8b4fd6':''}">${SIMSTATE.stopEach?'✓ ':''}${LANG==='vi'?'Dừng sau mỗi bước':'Stop after each operation'}</button>${SIMSTATE.stopAt!=null?`<span class="pill" style="background:#8b4fd6;color:#fff">${LANG==='vi'?'Dừng sau bước':'Stop after op'} ${SIMSTATE.stopAt+1} <button data-act="simClrStop" style="border:0;background:none;color:#fff;font-weight:700;cursor:pointer">✕</button></span>`:''}</div>
  <div class="legend" id="simLegend"></div></div>
 <div class="ops" id="simOps" style="margin-top:12px"></div>`;
 if(SIMSTATE.dirty||!SIM)simInit();
 const cv=$('#svc');const ro=new ResizeObserver(()=>simDraw());ro.observe(cv);
 const pts=new Map();cv.addEventListener('pointerdown',e=>{pts.set(e.pointerId,[e.clientX,e.clientY]);cv.setPointerCapture(e.pointerId);});
 cv.addEventListener('pointermove',e=>{const p=pts.get(e.pointerId);if(!p)return;if(pts.size===1){if(SIMSTATE.mode==='3d'){SIMSTATE.yaw+=(e.clientX-p[0])*0.008;SIMSTATE.pitch=Math.max(0,Math.min(Math.PI/2,SIMSTATE.pitch+(e.clientY-p[1])*0.006));}}
  else{const o=[...pts.entries()].find(([k])=>k!==e.pointerId)[1];const d0=Math.hypot(p[0]-o[0],p[1]-o[1]),d1=Math.hypot(e.clientX-o[0],e.clientY-o[1]);if(d0>0&&SETS().viewZoom)SIMSTATE.zoom=Math.max(0.3,Math.min(8,SIMSTATE.zoom*d1/d0));}
  pts.set(e.pointerId,[e.clientX,e.clientY]);simDraw();});
 const upP=e=>{pts.delete(e.pointerId);};cv.addEventListener('pointerup',upP);cv.addEventListener('pointercancel',upP);cv.addEventListener('wheel',e=>{e.preventDefault();SIMSTATE.zoom*=e.deltaY<0?1.1:0.9;simDraw();},{passive:false});
 const vc=$('#vcc');if(vc){vc.addEventListener('click',e=>{const r=vc.getBoundingClientRect();cubeClick(e.clientX-r.left,e.clientY-r.top);});vc.addEventListener('pointermove',e=>{const r=vc.getBoundingClientRect();const h=cubeHit(e.clientX-r.left,e.clientY-r.top);const k=h&&h[0]==='face'?h[1]:null;if(k!==SIMSTATE._vh){SIMSTATE._vh=k;drawCube();}vc.style.cursor=h?'pointer':'default';});}
 const ops=[...new Set(CS().map(s=>s[9]))].filter(i=>i>=0);
 $('#simOps').innerHTML=ops.map(i=>{const o=S.ops[i],tl=toolById(o.tool);return`<div class="op"><div class="oph" data-simop="${i}">${opIcon(o.type,OPCOL[i%OPCOL.length],i+1)}<span class="opt"><b>${esc(opLabel(o.type))}</b><span>T${tl.num} ${esc(tl.desc)}</span></span><button class="btn sm" data-simto="${i}" style="${SIMSTATE.stopAt===i?'background:#8b4fd6;color:#fff':''}">▶| ${LANG==='vi'?'Chạy tới hết':'Run to end'}</button></div></div>`;}).join('');
 simLegend();simDraw();
}
function simLegend(){const el=$('#simLegend');if(!el)return;const used=[...new Set(CS().map(s=>s[9]))].filter(i=>i>=0);
 if(SIMSTATE.color==='op')el.innerHTML=used.map(i=>`<span><i class="dot" style="background:${OPCOL[i%OPCOL.length]}"></i>${i+1} ${esc(opLabel(S.ops[i].type))}</span>`).join('');
 else if(SIMSTATE.color==='tool'){const ts=[...new Set(used.map(i=>S.ops[i].tool))];el.innerHTML=ts.map(id=>{const k=S.tools.findIndex(x=>x.id===id),x=S.tools[k];return`<span><i class="dot" style="background:${TOOLCOL[k%TOOLCOL.length]}"></i>T${x.num} ${esc(x.desc)}</span>`;}).join('');}
 else el.innerHTML=`<span style="background:linear-gradient(90deg,${mat().color},#2a5aa0);color:#fff">Z0 → Z${fl(SIM?SIM.bot:0,3)}</span>`;}
function simJump(target){simInit();const sav=CS();let guard=0;while(SIM.i<target&&guard++<1e7){const s=CS()[SIM.i];simAdvance(Math.hypot(s[3]-s[0],s[4]-s[1],s[5]-s[2])*(1-SIM.u)+1e-9);}simDraw();}
let simRAF=0,simLast=0;
function simLoop(ts){if(!SIMSTATE.playing){return;}const dt=Math.min(0.1,(ts-(simLast||ts))/1000);simLast=ts;
 const ips=0.6*Math.pow(3,SIMSTATE.speed);simSetLimit();simAdvance(ips*dt);if(SIM.done||(SIM.limit!=null&&SIM.i>=SIM.limit)){const hitStop=!SIM.done;SIMSTATE.playing=false;if(hitStop&&SIMSTATE.stopAt!=null&&SIM.i>=opEnd(SIMSTATE.stopAt))SIMSTATE.stopAt=null;SIM.limit=null;updPlay();simDraw();if(hitStop){const nx=CS()[SIM.i];toast((LANG==='vi'?'Dừng sau bước ':'Stopped after op ')+(CS()[SIM.i-1]?CS()[SIM.i-1][9]+1:''));}rSimOpsMark();return;}
 if(ts-(simLoop.d||0)>(SIMSTATE.mode==='3d'?90:40)){simDraw();simLoop.d=ts;}
 simRAF=requestAnimationFrame(simLoop);}
function opEnd(oi){const c=CS();let e=-1;for(let k=c.length-1;k>=0;k--)if(c[k][9]===oi){e=k+1;break;}return e;}
function simSetLimit(){let lim=null;const c=CS();if(SIMSTATE.stopAt!=null){const e=opEnd(SIMSTATE.stopAt);if(e>SIM.i)lim=e;}
 if(SIMSTATE.stopEach){let cur=-1;for(let k=SIM.i;k<c.length;k++){if(c[k][9]>=0){cur=c[k][9];break;}}if(cur>=0){const e=opEnd(cur);if(e>SIM.i&&(lim==null||e<lim))lim=e;}}SIM.limit=lim;}
function rSimOpsMark(){$$('[data-simto]').forEach(b=>{const on=SIMSTATE.stopAt===+b.dataset.simto;b.style.background=on?'#8b4fd6':'';b.style.color=on?'#fff':'';});}
/* ----- view cube ----- */
let vcAnim=0;
function viewTo(yaw,pitch,zoom){const y0=SIMSTATE.yaw,p0=SIMSTATE.pitch,z0=SIMSTATE.zoom;let dy=yaw-y0;dy=Math.atan2(Math.sin(dy),Math.cos(dy));const t0=performance.now();cancelAnimationFrame(vcAnim);
 if(SIMSTATE.mode!=='3d'){SIMSTATE.mode='3d';$$('#simMode button').forEach(b=>b.classList.toggle('on',b.dataset.m==='3d'));}
 const step=(ts)=>{const u=Math.min(1,(ts-t0)/280),e=u<.5?2*u*u:1-Math.pow(-2*u+2,2)/2;SIMSTATE.yaw=y0+dy*e;SIMSTATE.pitch=p0+(pitch-p0)*e;if(zoom!=null)SIMSTATE.zoom=z0+(zoom-z0)*e;simDraw();if(u<1)vcAnim=requestAnimationFrame(step);};vcAnim=requestAnimationFrame(step);}
const VFACES=[['top',[0,0,1],[[-1,-1,1],[1,-1,1],[1,1,1],[-1,1,1]],['Top','Trên']],['bot',[0,0,-1],[[-1,-1,-1],[-1,1,-1],[1,1,-1],[1,-1,-1]],['Bottom','Dưới']],['front',[0,-1,0],[[-1,-1,-1],[1,-1,-1],[1,-1,1],[-1,-1,1]],['Front','Trước']],['back',[0,1,0],[[1,1,-1],[-1,1,-1],[-1,1,1],[1,1,1]],['Back','Sau']],['right',[1,0,0],[[1,-1,-1],[1,1,-1],[1,1,1],[1,-1,1]],['Right','Phải']],['left',[-1,0,0],[[-1,1,-1],[-1,-1,-1],[-1,-1,1],[-1,1,1]],['Left','Trái']]];
function vcProj(){const cy=Math.cos(SIMSTATE.yaw),sy=Math.sin(SIMSTATE.yaw),cp=Math.cos(SIMSTATE.pitch),sp=Math.sin(SIMSTATE.pitch);return(v,s,c)=>{const xr=v[0]*cy-v[1]*sy,yr=v[0]*sy+v[1]*cy;return[c+xr*s,c-(yr*cp+v[2]*sp)*s,yr*sp-v[2]*cp];};}
function drawCube(){const cv=$('#vcc');if(!cv||!SIMSTATE.sh.cube)return;const dpr=Math.min(2,devicePixelRatio||1),W=124;cv.width=W*dpr;cv.height=W*dpr;const g=cv.getContext('2d');g.setTransform(dpr,0,0,dpr,0,0);g.clearRect(0,0,W,W);
 const P=vcProj(),s=22,c=62,vi=LANG==='vi';const dark=matchMedia('(prefers-color-scheme: dark)').matches&&!document.documentElement.classList.contains('light');
 // axis triad from back-left-bottom corner
 const o=[-1.25,-1.25,-1.25],ax=[[[1.6,-1.25,-1.25],'#d93a3a','X'],[[-1.25,1.6,-1.25],'#1c9b5f','Y'],[[-1.25,-1.25,1.6],'#2457d6','Z']];const O=P(o,s,c);
 const faces=VFACES.map(f=>{const n=P(f[1],1,0);return{f,vis:n[2]<-0.02,pts:f[2].map(v=>P(v,s,c)),nz:n[2]};}).filter(x=>x.vis).sort((a,b)=>b.nz-a.nz);
 for(const a of ax){const A=P(a[0],s,c);g.strokeStyle=a[1];g.lineWidth=2;g.beginPath();g.moveTo(O[0],O[1]);g.lineTo(A[0],A[1]);g.stroke();g.fillStyle=a[1];g.font='700 10px Barlow,sans-serif';g.fillText(a[2],A[0]+2,A[1]+3);}
 SIMSTATE._vc=faces;
 for(const F of faces){const p=F.pts,hov=SIMSTATE._vh===F.f[0];g.beginPath();g.moveTo(p[0][0],p[0][1]);for(let k=1;k<4;k++)g.lineTo(p[k][0],p[k][1]);g.closePath();const l=Math.round(200+50*Math.min(1,-F.nz));g.fillStyle=hov?'#cfe0ff':`rgb(${l},${l},${Math.min(255,l+6)})`;g.fill();g.strokeStyle='#8a939b';g.lineWidth=1.2;g.stroke();
  const cx=(p[0][0]+p[2][0])/2,cy=(p[0][1]+p[2][1])/2,ux=(p[1][0]-p[0][0]),uy=(p[1][1]-p[0][1]),vx=(p[3][0]-p[0][0]),vy=(p[3][1]-p[0][1]);const area=Math.abs(ux*vy-uy*vx);if(area<90)continue;
  g.save();g.translate(cx,cy);g.transform(ux/(2*s),uy/(2*s),-vx/(2*s),-vy/(2*s),0,0);g.fillStyle='#14181c';g.font='700 10px Barlow,sans-serif';g.textAlign='center';g.textBaseline='middle';g.fillText(F.f[3][vi?1:0],0,0);g.restore();}
 // corner dots for iso
 SIMSTATE._vcc=[];for(const sx of[-1,1])for(const sy_ of[-1,1])for(const sz of[1,-1]){const q=P([sx,sy_,sz],s,c);const vis=faces.some(F=>F.f[2].some(v=>v[0]===sx&&v[1]===sy_&&v[2]===sz));if(!vis)continue;const front=P([sx,sy_,sz],1,0)[2]<-0.5;if(!front)continue;SIMSTATE._vcc.push([q[0],q[1],sx,sy_,sz]);g.beginPath();g.arc(q[0],q[1],4,0,7);g.fillStyle='#ff6a13';g.fill();}}
function cubeHit(x,y){for(const q of SIMSTATE._vcc||[])if(Math.hypot(q[0]-x,q[1]-y)<9)return['corner',q];const F=(SIMSTATE._vc||[]).slice().reverse();for(const f of F){const p=f.pts;let ins=false;for(let i=0,j=3;i<4;j=i++){if(((p[i][1]>y)!==(p[j][1]>y))&&(x<(p[j][0]-p[i][0])*(y-p[i][1])/(p[j][1]-p[i][1])+p[i][0]))ins=!ins;}if(ins)return['face',f.f[0]];}return null;}
function cubeClick(x,y){const h=cubeHit(x,y);if(!h)return;const snap=Math.round(SIMSTATE.yaw/(Math.PI/2))*(Math.PI/2);
 if(h[0]==='corner'){const q=h[1];viewTo(Math.atan2(-q[2],-q[3]),q[4]>0?0.96:Math.PI/2);return;}
 const V={top:[snap,0],bot:[snap,Math.PI/2],front:[0,Math.PI/2],back:[Math.PI,Math.PI/2],right:[-Math.PI/2,Math.PI/2],left:[Math.PI/2,Math.PI/2]}[h[1]];viewTo(V[0],V[1]);}
function updPlay(){const b=$('#simPlay');if(b)b.innerHTML=SIMSTATE.playing?IC.pause+t('pause'):IC.play+t('play');}
function shade(nx_,ny_,nz_){const l=[-0.45,-0.55,0.7],ln=Math.hypot(...l);let d=(nx_*l[0]+ny_*l[1]+nz_*l[2])/ln/Math.hypot(nx_,ny_,nz_);return 0.5+0.62*Math.max(0,d);}
function hexRGB(h){h=h.replace('#','');return[parseInt(h.slice(0,2),16),parseInt(h.slice(2,4),16),parseInt(h.slice(4,6),16)];}
function cellColor(z,lum,ow){if(ow!=null&&ow>=0&&SIMSTATE.color!=='depth'&&SIM.top-z>0.0005){const o=S.ops[ow];const col=SIMSTATE.color==='tool'?TOOLCOL[Math.max(0,S.tools.findIndex(x=>x.id===(o&&o.tool)))%TOOLCOL.length]:OPCOL[ow%OPCOL.length];const c=hexRGB(col),b=hexRGB(mat().color);return[Math.min(255,(c[0]*0.62+b[0]*0.38)*lum),Math.min(255,(c[1]*0.62+b[1]*0.38)*lum),Math.min(255,(c[2]*0.62+b[2]*0.38)*lum)];}const base=hexRGB(mat().color),depth=(SIM.top-z)/Math.max(0.01,SIM.top-SIM.bot);const cut=SIM.top-z>0.0005;
 let r=base[0],g=base[1],b=base[2];if(cut){const k=Math.min(1,depth);r=r*(1-0.25*k)+40*0.25*k;g=g*(1-0.2*k)+90*0.2*k;b=b*(1-0.1*k)+200*0.1*k;}else{r=r*0.92+36*0.08;g=g*0.92+87*0.08;b=b*0.92+214*0.08;}
 return[Math.min(255,r*lum),Math.min(255,g*lum),Math.min(255,b*lum)];}
function simDraw(){if(SIMSTATE.axis==='4'){sim4Draw();return;}
 const cv=$('#svc');if(!cv||!SIM)return;const dpr=Math.min(2,devicePixelRatio||1),W=cv.clientWidth,H=cv.clientHeight;if(!W)return;cv.width=W*dpr;cv.height=H*dpr;const g=cv.getContext('2d');g.setTransform(dpr,0,0,dpr,0,0);g.clearRect(0,0,W,H);
 const{nx,ny,h,res,sr}=SIM;const s=CS()[Math.min(SIM.i,CS().length-1)];const ti=s?s[7]:-1,tl=S.tools[ti];
 if(SIMSTATE.mode==='top'){
  const img=g.createImageData(nx,ny);for(let j=0;j<ny;j++)for(let i=0;i<nx;i++){const k=j*nx+i,zl=h[j*nx+Math.max(0,i-1)],zr=h[j*nx+Math.min(nx-1,i+1)],zd=h[Math.max(0,j-1)*nx+i],zu=h[Math.min(ny-1,j+1)*nx+i];
   const lum=shade(-(zr-zl)/(2*res),-(zu-zd)/(2*res),1);const c=cellColor(h[k],lum,SIM.own[k]);const o=((ny-1-j)*nx+i)*4;img.data[o]=c[0];img.data[o+1]=c[1];img.data[o+2]=c[2];img.data[o+3]=255;}
  const oc=document.createElement('canvas');oc.width=nx;oc.height=ny;oc.getContext('2d').putImageData(img,0,0);
  const sc=Math.min(W/nx,H/ny)*0.9*SIMSTATE.zoom,ox=(W-nx*sc)/2,oy=(H-ny*sc)/2;g.imageSmoothingEnabled=true;g.drawImage(oc,ox,oy,nx*sc,ny*sc);
  const X=x=>ox+(x-sr[0])/res*sc,Y=y=>oy+(ny-1-(y-sr[1])/res)*sc;
  simPaths(g,(x,y,z)=>[X(x),Y(y)]);
  if(SIMSTATE.sh.fix&&['vise','softjaw'].includes(S.fixture.type)){g.fillStyle=S.fixture.type==='softjaw'?'rgba(201,162,74,.85)':'rgba(60,111,209,.85)';const jl=Math.max(sr[2]-sr[0]+0.8,S.fixture.vise||6)/res*sc,xc=(X(sr[0])+X(sr[2]))/2,jw=0.7/res*sc;g.fillRect(xc-jl/2,Y(sr[1]),jl,jw);g.fillRect(xc-jl/2,Y(sr[3])-jw,jl,jw);}
  if(tl&&SIMSTATE.sh.tool){g.beginPath();g.arc(X(SIM.pos[0]),Y(SIM.pos[1]),tl.dia/2/res*sc,0,7);g.fillStyle='rgba(255,106,19,.35)';g.fill();g.strokeStyle='#ff6a13';g.lineWidth=2;g.stroke();}
 }else{
  const st=Math.max(1,Math.ceil(Math.max(nx,ny)/(SIMSTATE.playing?120:(SIMSTATE.hd?230:170)))),cx=(sr[0]+sr[2])/2,cy=(sr[1]+sr[3])/2,zc=(SIM.top+SIM.bot)/2;
  const cyw=Math.cos(SIMSTATE.yaw),syw=Math.sin(SIMSTATE.yaw),cp=Math.cos(SIMSTATE.pitch),sp=Math.sin(SIMSTATE.pitch);
  const span=Math.max(sr[2]-sr[0],sr[3]-sr[1],S.stock.z*1.5)*(SIMSTATE.sh.fix?1.3:1);const sc=Math.min(W,H)/span*0.72*SIMSTATE.zoom;
  const P=(x,y,z)=>{const dx=x-cx,dy=y-cy,xr=dx*cyw-dy*syw,yr=dx*syw+dy*cyw,zz=z-zc;return[W/2+xr*sc,H*0.52-(yr*cp+zz*sp)*sc,yr*sp-zz*cp];};
  const gx=Math.floor((nx-1)/st),gy=Math.floor((ny-1)/st);const Z=(i,j)=>h[Math.min(ny-1,j*st)*nx+Math.min(nx-1,i*st)];const OW=(i,j)=>{let best=-1,bz=1e9;for(let jj=j*st;jj<Math.min(ny,(j+1)*st+1);jj++)for(let ii=i*st;ii<Math.min(nx,(i+1)*st+1);ii++){const k=jj*nx+ii;if(h[k]<bz){bz=h[k];best=SIM.own[k];}}return best;};const wx=i=>sr[0]+Math.min(nx-1,i*st)*res,wy=j=>sr[1]+Math.min(ny-1,j*st)*res;
  const quads=[];
  for(let j=0;j<gy;j++)for(let i=0;i<gx;i++){const z00=Z(i,j),z10=Z(i+1,j),z01=Z(i,j+1),z11=Z(i+1,j+1);const a=P(wx(i),wy(j),z00),b=P(wx(i+1),wy(j),z10),c=P(wx(i+1),wy(j+1),z11),d=P(wx(i),wy(j+1),z01);
   const lum=shade(-((z10+z11)-(z00+z01))/(2*st*res),-((z01+z11)-(z00+z10))/(2*st*res),1);quads.push([(a[2]+b[2]+c[2]+d[2])/4,[a,b,c,d],cellColor((z00+z10+z01+z11)/4,lum,OW(i,j))]);}
  const side=(pts,lum)=>{const c=hexRGB(mat().color).map(v=>v*lum);quads.push([pts.reduce((s,p)=>s+p[2],0)/pts.length,pts,c]);};
  for(let i=0;i<gx;i++){side([P(wx(i),wy(0),Z(i,0)),P(wx(i+1),wy(0),Z(i+1,0)),P(wx(i+1),wy(0),SIM.bot),P(wx(i),wy(0),SIM.bot)],0.62);side([P(wx(i),wy(gy),Z(i,gy)),P(wx(i+1),wy(gy),Z(i+1,gy)),P(wx(i+1),wy(gy),SIM.bot),P(wx(i),wy(gy),SIM.bot)],0.5);}
  for(let j=0;j<gy;j++){side([P(wx(0),wy(j),Z(0,j)),P(wx(0),wy(j+1),Z(0,j+1)),P(wx(0),wy(j+1),SIM.bot),P(wx(0),wy(j),SIM.bot)],0.55);side([P(wx(gx),wy(j),Z(gx,j)),P(wx(gx),wy(j+1),Z(gx,j+1)),P(wx(gx),wy(j+1),SIM.bot),P(wx(gx),wy(j),SIM.bot)],0.72);}
  if(SIMSTATE.sh.fix)simFixture(P,quads);
  quads.sort((a,b)=>b[0]-a[0]);
  for(const q of quads){const p=q[1],c=q[2];g.beginPath();g.moveTo(p[0][0],p[0][1]);for(let k=1;k<p.length;k++)g.lineTo(p[k][0],p[k][1]);g.closePath();const col=`rgb(${c[0]|0},${c[1]|0},${c[2]|0})`;g.fillStyle=col;g.strokeStyle=col;g.lineWidth=0.6;g.fill();g.stroke();}
  // upcoming path
  simPaths(g,P);
  if(tl&&SIMSTATE.sh.tool){const[x,y,z]=SIM.pos,r=tl.dia/2,len=Math.min(tl.loc||1,1.5)+0.6;const b0=P(x,y,z),t0=P(x,y,z+len);const rx=r*sc,ry=r*sc*cp;const grd=g.createLinearGradient(b0[0]-rx,0,b0[0]+rx,0);grd.addColorStop(0,'#555');grd.addColorStop(.35,'#f2f4f6');grd.addColorStop(.6,'#aab0b6');grd.addColorStop(1,'#444');
   const ey=Math.max(1,ry);g.fillStyle=grd;g.fillRect(b0[0]-rx,t0[1],2*rx,b0[1]-t0[1]);g.beginPath();g.ellipse(b0[0],b0[1],rx,ey,0,0,Math.PI);g.fill();g.fillStyle='#e3e7ea';g.beginPath();g.ellipse(t0[0],t0[1],rx,ey,0,0,7);g.fill();
   g.strokeStyle='#ff6a13';g.lineWidth=2;g.beginPath();g.ellipse(b0[0],b0[1],rx,Math.max(1,ry),0,0,7);g.stroke();}
 }
 const o=s&&s[9]>=0?S.ops[s[9]]:null;const info=$('#simInfo');
 if(info)info.textContent=(o?(s[9]+1)+' '+opLabel(o.type)+' · ':'')+(tl?'T'+tl.num+' · ':'')+'X'+fl(SIM.pos[0],3)+' Y'+fl(SIM.pos[1],3)+' Z'+fl(SIM.pos[2],3)+' · '+Math.round(SIM.i/CS().length*100)+'%';
 const cr=$('#simCrash');if(cr)cr.style.display=SIM.crash.length?'':'none';const sb=$('#simScrub');if(sb&&document.activeElement!==sb)sb.value=SIM.i;drawCube();
}

function simPaths(g,P){const sh=SIMSTATE.sh,c=CS();if(!sh.path&&!sh.rapid)return;const a0=sh.all?0:SIM.i,a1=sh.all?c.length:Math.min(c.length,SIM.i+2500),st=Math.max(1,Math.ceil((a1-a0)/12000));
 const seg=(cut)=>{g.beginPath();for(let k=a0;k<a1;k+=(cut?st:1)){const q=c[k];if((q[6]===0)===cut)continue;const a=P(q[0],q[1],q[2]),b=P(q[3],q[4],q[5]);g.moveTo(a[0],a[1]);g.lineTo(b[0],b[1]);}g.stroke();};
 if(sh.path){if(sh.all&&SIM.i>0){g.globalAlpha=.25;g.strokeStyle='#8a939b';g.lineWidth=1;g.beginPath();for(let k=0;k<SIM.i;k+=st){const q=c[k];if(q[6]===0)continue;const a=P(q[0],q[1],q[2]),b=P(q[3],q[4],q[5]);g.moveTo(a[0],a[1]);g.lineTo(b[0],b[1]);}g.stroke();}
  g.globalAlpha=.55;g.strokeStyle='#2457d6';g.lineWidth=1;g.beginPath();for(let k=SIM.i;k<a1;k+=st){const q=c[k];if(q[6]===0)continue;const a=P(q[0],q[1],q[2]),b=P(q[3],q[4],q[5]);g.moveTo(a[0],a[1]);g.lineTo(b[0],b[1]);}g.stroke();}
 if(sh.rapid){g.globalAlpha=.75;g.strokeStyle='#d93a3a';g.lineWidth=1.2;g.setLineDash([5,4]);seg(false);g.setLineDash([]);}g.globalAlpha=1;}
/* ----- fixture in 3D sim ----- */
function simFixture(P,quads){const fx=S.fixture,sr=SIM.sr,bot=SIM.bot,W=sr[2]-sr[0],H=sr[3]-sr[1];
 const box=(x0,y0,z0,x1,y1,z1,hex)=>{const c=hexRGB(hex),F=(pts,l)=>{const pp=pts.map(p=>P(...p));quads.push([pp.reduce((s,p)=>s+p[2],0)/4,pp,c.map(v=>v*l)]);};
  F([[x0,y0,z1],[x1,y0,z1],[x1,y1,z1],[x0,y1,z1]],1.05);F([[x0,y0,z0],[x1,y0,z0],[x1,y0,z1],[x0,y0,z1]],0.62);F([[x0,y1,z0],[x1,y1,z0],[x1,y1,z1],[x0,y1,z1]],0.5);F([[x0,y0,z0],[x0,y1,z0],[x0,y1,z1],[x0,y0,z1]],0.55);F([[x1,y0,z0],[x1,y1,z0],[x1,y1,z1],[x1,y0,z1]],0.72);};
 const t=fx.type,ext=Math.max(0.6,Math.min(W,H)*0.25);
 if(t==='vise'||t==='softjaw'){const grip=Math.max(0.1,S.stock.z-(fixtureCheck()?fixtureCheck().so:S.stock.z-0.3)),jt=bot+grip,jw=0.7,par=Math.max(0.1,fx.parH||0.5),jl=Math.max(W+0.8,(fx.vise||6));const xc=(sr[0]+sr[2])/2;
  box(xc-jl/2,sr[1]-jw,jt-(fx.jawH||1.75),xc+jl/2,sr[1],jt,t==='softjaw'?'#c9a24a':'#3c6fd1');box(xc-jl/2,sr[3],jt-(fx.jawH||1.75),xc+jl/2,sr[3]+jw,jt,t==='softjaw'?'#c9a24a':'#2f5fbf');
  box(sr[0]+0.1,sr[1]+0.02,bot-par,sr[2]-0.1,sr[1]+Math.min(0.25,H*0.2),bot,'#d7dbdf');box(sr[0]+0.1,sr[3]-Math.min(0.25,H*0.2),bot-par,sr[2]-0.1,sr[3]-0.02,bot,'#d7dbdf');
  box(xc-jl/2,sr[1]-jw,bot-par-0.6,xc+jl/2,sr[3]+jw,bot-par,'#4a5560');}
 else if(t==='clamps'||t==='plate'){box(sr[0]-ext,sr[1]-ext,bot-0.75,sr[2]+ext,sr[3]+ext,bot,t==='plate'?'#8a939b':'#5d666e');
  if(t==='clamps')for(const[x,y]of[[sr[0],sr[1]],[sr[2],sr[1]],[sr[0],sr[3]],[sr[2],sr[3]]]){const dx=x<sr[0]+W/2?-1:1;box(x-dx*0.15,y-0.2,bot+S.stock.z*0.98,x+dx*0.9,y+0.2,bot+S.stock.z*0.98+0.25,'#e39b00');}
  else for(const[x,y]of[[sr[0]-ext/2,sr[1]-ext/2],[sr[2]+ext/2,sr[1]-ext/2],[sr[0]-ext/2,sr[3]+ext/2],[sr[2]+ext/2,sr[3]+ext/2]])box(x-0.12,y-0.12,bot,x+0.12,y+0.12,bot+0.15,'#30363c');}
 else if(t==='angle'){box(sr[0]-0.3,sr[1]-1.1,bot-0.5,sr[2]+0.3,sr[1],bot+S.stock.z*0.8,'#6b737a');box(sr[0]-0.3,sr[1]-1.1,bot-1.2,sr[2]+0.3,sr[3]+0.5,bot-0.5,'#4a5560');}
 else if(t==='collet'){const xc=(sr[0]+sr[2])/2,yc=(sr[1]+sr[3])/2,r=Math.max(W,H)/2+0.4;box(xc-r,yc-r,bot-1.5,xc+r,yc+r,bot+0.25,'#3c6fd1');}}
/* ----- 5-axis stamping (tilted tool) ----- */
function stamp5(x,y,z,vx,vy,vz,ti,oi){const tl=S.tools[ti];if(!tl)return;const r=tl.dia/2,res=SIM.res,nx=SIM.nx,ny=SIM.ny,h=SIM.h,sr=SIM.sr;
 const disk=(cx,cy,cz,rad,sph)=>{if(cz>SIM.top+rad)return;const n=Math.ceil(rad/res),ci=Math.round((cx-sr[0])/res),cj=Math.round((cy-sr[1])/res);for(let j=-n;j<=n;j++)for(let i=-n;i<=n;i++){const ii=ci+i,jj=cj+j;if(ii<0||jj<0||ii>=nx||jj>=ny)continue;const d2=(i*i+j*j)*res*res;if(d2>rad*rad)continue;const zz=sph?cz-Math.sqrt(rad*rad-d2):cz;const k=jj*nx+ii;if(zz<h[k]){h[k]=zz;SIM.own[k]=oi;}}};
 if(tl.type==='ball')disk(x+r*vx,y+r*vy,z+r*vz,r,true);else{const L=Math.min(tl.loc||1,1.5);for(let k=0;k<=L;k+=res)disk(x+vx*k,y+vy*k,z+vz*k,r,false);}}
/* ----- 4th axis simulator (cylindrical stock, part frame) ----- */
function sim4Init(){const S4=SEGS4;let x0=1e9,x1=-1e9,zmax=0;for(const s of S4){x0=Math.min(x0,s[0],s[3]);x1=Math.max(x1,s[0],s[3]);if(s[6]===1)zmax=Math.max(zmax,s[1],s[4]);}
 let R0=0;S.ops.forEach(o=>{if(!o.on)return;if(o.type==='rotRough')R0=Math.max(R0,(o.d0||1)/2);if(o.type==='wrap')R0=Math.max(R0,(o.wrapD||1)/2);});if(S.cylMap)R0=Math.max(R0,Math.max(...S.cylMap.R)+0.05);if(!R0)R0=zmax+0.02;
 const tlMax=Math.max(0.1,...S.tools.map(t_=>t_.dia/2));x0-=tlMax;x1+=tlMax;const len=Math.max(0.2,x1-x0),res=len/(SIMSTATE.hd?320:200),nx=Math.ceil(len/res)+1,nth=SIMSTATE.hd?240:150;
 SIM={rot:true,x0,res,nx,nth,R:new Float32Array(nx*nth).fill(R0),own:new Int16Array(nx*nth).fill(-1),R0,i:0,u:0,pos:[x0,R0+0.3,0],crash:[],done:false};SIMSTATE.dirty=false;}
function stamp4(x,z,a,ti,oi,rapid){const tl=S.tools[ti];if(!tl)return;const r=tl.dia/2,{x0,res,nx,nth,R}=SIM,dth=2*Math.PI/nth,th=a*Math.PI/180,ball=tl.type==='ball';
 const ni=Math.ceil(r/res),nj=Math.ceil(Math.asin(Math.min(1,r/Math.max(z,r)))/dth)+1,ci=Math.round((x-x0)/res),cj=Math.round(th/dth);
 for(let di=-ni;di<=ni;di++){const ii=ci+di;if(ii<0||ii>=nx)continue;const dx=di*res;if(dx*dx>r*r)continue;for(let dj=-nj;dj<=nj;dj++){const jj=((cj+dj)%nth+nth)%nth,ph=dj*dth;let lim;
   if(ball){const c=z+r,q=r*r-dx*dx-c*c*Math.sin(ph)**2;if(q<0)continue;lim=c*Math.cos(ph)-Math.sqrt(q);}else{const lat=z*Math.tan(Math.abs(ph));if(Math.abs(ph)>=Math.PI/2||lat*lat+dx*dx>r*r)continue;lim=z/Math.cos(ph);}
   const k=jj*nx+ii;if(lim<R[k]){if(rapid){if(R[k]-lim>0.002){SIM.crash.push([x,z,a]);return;}}else{R[k]=Math.max(0,lim);SIM.own[k]=oi;}}}}}
function sim4Advance(dist){let left=dist;const S4=SEGS4;const lim=SIM.limit!=null?SIM.limit:S4.length;while(left>0&&SIM.i<lim){const s=S4[SIM.i];const rr=Math.max(0.05,(s[1]+s[4])/2);const L=Math.hypot(s[3]-s[0],s[4]-s[1],(s[5]-s[2])*Math.PI/180*rr);const rem=L*(1-SIM.u),take=Math.min(rem,left),u0=SIM.u,u1=L>0?SIM.u+take/L:1;
  const n=Math.max(1,Math.ceil(take/(SIM.res*0.5)));for(let k=1;k<=n;k++){const u=u0+(u1-u0)*k/n;const x=s[0]+(s[3]-s[0])*u,z=s[1]+(s[4]-s[1])*u,a=s[2]+(s[5]-s[2])*u;stamp4(x,z,a,s[7],s[9],s[6]===0);SIM.pos=[x,z,a];}
  left-=take;SIM.u=u1;if(SIM.u>=1-1e-9){SIM.i++;SIM.u=0;}}if(SIM.i>=S4.length)SIM.done=true;}
function sim4Draw(){const cv=$('#svc');if(!cv||!SIM||!SIM.rot)return;const dpr=Math.min(2,devicePixelRatio||1),W=cv.clientWidth,H=cv.clientHeight;if(!W)return;cv.width=W*dpr;cv.height=H*dpr;const g=cv.getContext('2d');g.setTransform(dpr,0,0,dpr,0,0);g.clearRect(0,0,W,H);
 const{x0,res,nx,nth,R,R0}=SIM,len=(nx-1)*res,xc=x0+len/2,dth=2*Math.PI/nth;const cyw=Math.cos(SIMSTATE.yaw),syw=Math.sin(SIMSTATE.yaw),cp=Math.cos(SIMSTATE.pitch),sp=Math.sin(SIMSTATE.pitch);
 const span=Math.max(len,R0*2.6),sc=Math.min(W,H)/span*0.78*SIMSTATE.zoom;
 const P=(x,y,z)=>{const dx=x-xc,xr=dx*cyw-y*syw,yr=dx*syw+y*cyw;return[W/2+xr*sc,H*0.5-(yr*cp+z*sp)*sc,yr*sp-z*cp];};
 const si=Math.max(1,Math.ceil(nx/(SIMSTATE.playing?90:150))),sj=Math.max(1,Math.ceil(nth/(SIMSTATE.playing?72:120)));const base=hexRGB(mat().color),L=[-0.4,-0.5,0.77];
 const pt=(i,j)=>{const ii=Math.min(nx-1,i),jj=((j%nth)+nth)%nth,r=R[jj*nx+ii],th=jj*dth;return[x0+ii*res,r*Math.sin(th),r*Math.cos(th)];};const quads=[];
 for(let i=0;i<nx-1;i+=si)for(let j=0;j<nth;j+=sj){const a=pt(i,j),b=pt(i+si,j),c=pt(i+si,j+sj),d=pt(i,j+sj);const th=(j+sj/2)*dth;const nrm=[0,Math.sin(th),Math.cos(th)];
   const yr=nrm[1]*cyw;const lum=0.45+0.6*Math.max(0,(nrm[1]*L[1]+nrm[2]*L[2]));const A=P(...a),B=P(...b),Cc=P(...c),D=P(...d);
   const ow=SIM.own[(((j%nth)+nth)%nth)*nx+i];let col=base;if(ow>=0&&SIMSTATE.color!=='depth'){const o=S.ops[ow];const cc=hexRGB(SIMSTATE.color==='tool'?TOOLCOL[Math.max(0,S.tools.findIndex(x=>x.id===(o&&o.tool)))%TOOLCOL.length]:OPCOL[ow%OPCOL.length]);col=[cc[0]*0.62+base[0]*0.38,cc[1]*0.62+base[1]*0.38,cc[2]*0.62+base[2]*0.38];}
   else if(SIMSTATE.color==='depth'){const k=Math.min(1,(R0-R[(((j%nth)+nth)%nth)*nx+i])/Math.max(0.01,R0));col=[base[0]*(1-k)+42*k,base[1]*(1-k)+90*k,base[2]*(1-k)+160*k];}
   quads.push([(A[2]+Cc[2])/2,[A,B,Cc,D],`rgb(${Math.min(255,col[0]*lum)|0},${Math.min(255,col[1]*lum)|0},${Math.min(255,col[2]*lum)|0})`]);}
 // end caps
 for(const ii of[0,nx-1]){const ring=[];for(let j=0;j<=nth;j+=sj)ring.push(P(...pt(ii,j)));const cz=ring.reduce((a,p)=>a+p[2],0)/ring.length;quads.push([cz,ring,`rgb(${base[0]*0.55|0},${base[1]*0.55|0},${base[2]*0.55|0})`]);}
 quads.sort((a,b)=>b[0]-a[0]);for(const q of quads){const p=q[1];g.beginPath();g.moveTo(p[0][0],p[0][1]);for(let k=1;k<p.length;k++)g.lineTo(p[k][0],p[k][1]);g.closePath();g.fillStyle=q[2];g.strokeStyle=q[2];g.lineWidth=0.6;g.fill();g.stroke();}
 const s=SEGS4[Math.min(SIM.i,SEGS4.length-1)],tl=s?S.tools[s[7]]:null;
 if(tl&&SIMSTATE.sh.tool){const[x,z,a]=SIM.pos,th=a*Math.PI/180,u=[0,Math.sin(th),Math.cos(th)];const tip=P(x,z*u[1],z*u[2]),top=P(x,(z+1.2)*u[1],(z+1.2)*u[2]);g.lineCap='round';g.strokeStyle='#b9c0c6';g.lineWidth=Math.max(3,tl.dia*sc);g.beginPath();g.moveTo(tip[0],tip[1]);g.lineTo(top[0],top[1]);g.stroke();
  g.strokeStyle='#ff6a13';g.lineWidth=2;g.beginPath();g.arc(tip[0],tip[1],Math.max(3,tl.dia*sc/2),0,7);g.stroke();}
 const o=s&&s[9]>=0?S.ops[s[9]]:null,info=$('#simInfo');if(info)info.textContent=(o?(s[9]+1)+' '+opLabel(o.type,o)+' · ':'')+(tl?'T'+tl.num+' · ':'')+'X'+fl(SIM.pos[0],3)+' Z'+fl(SIM.pos[1],3)+' A'+(+SIM.pos[2]).toFixed(1)+'° · '+Math.round(SIM.i/Math.max(1,SEGS4.length)*100)+'%';
 const cr=$('#simCrash');if(cr)cr.style.display=SIM.crash.length?'':'none';const sb=$('#simScrub');if(sb&&document.activeElement!==sb)sb.value=SIM.i;drawCube();}

/* ----- calculators ----- */
const CALC={hd:{v:30,s:'HRC'},type:'flat',kind:'adaptive',dia:0.5,fl:3,tm:'carbide',woc:0,doc:0,bc:{x:0,y:0,d:2,n:6,a:0,h:0.257},cv:{in:1},ch:{c:0.02,a:90,tip:0}};
function rCalc(){
 const c=CALC,tl={type:c.type,dia:c.dia,flutes:c.fl,mat:c.tm,loc:c.dia*3,pitch:1/20,tipAngle:118};const r=C.feeds(tl,mat(),c.kind,{machine:mach(),woc:c.woc,doc:c.doc});
 const bcPts=[];for(let i=0;i<c.bc.n;i++){const a=(c.bc.a+360*i/c.bc.n)*Math.PI/180;bcPts.push([c.bc.x+c.bc.d/2*Math.cos(a),c.bc.y+c.bc.d/2*Math.sin(a)]);}
 const ha=c.ch.a/2*Math.PI/180,chDepth=c.ch.c/Math.tan(ha)+ (c.ch.tip/2)/Math.tan(ha);
 const ci=(k,v,path,u)=>inp(k,u==='L'?fl(v):v,`data-c="${path}" data-u="${u||'N'}"`);
 $('#main').innerHTML=`<h1>${t('calcTitle')}</h1><p class="sub">${esc(LANG==='vi'?mat().vi:mat().en)} · ${esc(mach().name)} · ≤${mach().rpmMax} rpm · ${mach().hp} HP${mach().approx?' · '+t('approx'):''}</p>
 <details class="acc" open><summary>${t('sf')}</summary><div>
  <div class="kpi" style="margin-bottom:12px"><div><span>${t('rpm')}</span><b>${r.rpm}</b></div><div><span>${t('feed')} ${flab()}</span><b>${ffd(r.feed)}</b></div><div><span>${t('fz')}</span><b>${r.fz?fl(r.fz,4):fl(r.ipr,4)}</b></div><div><span>${t('sfm')}</span><b>${r.sfm}</b></div>${r.mrr?`<div><span>${t('mrr')}</span><b>${r.mrr.toFixed(2)}</b></div><div><span>${t('hp')}</span><b>${r.hp.toFixed(2)}</b></div>`:''}</div>
  <div class="fields"><label class="f">${t('type')}<select data-c="type" data-u="S">${['flat','ball','bull','face','drill','spot','tap','reamer','chamfer'].map(k=>`<option ${k===c.type?'selected':''}>${k}</option>`).join('')}</select></label>
  <label class="f">${t('kind')}<select data-c="kind" data-u="S">${['adaptive','rough','slot','finish','face','drill','spot','tap','ream','bore','chamfer'].map(k=>`<option ${k===c.kind?'selected':''}>${k}</option>`).join('')}</select></label>
  ${ci('dia',c.dia,'dia','L')}${ci('flutes',c.fl,'fl')}<label class="f">${t('tmat')}<select data-c="tm" data-u="S"><option value="carbide" ${c.tm==='carbide'?'selected':''}>Carbide</option><option value="hss" ${c.tm==='hss'?'selected':''}>HSS</option></select></label>
  ${ci('woc',c.woc||r.woc,'woc','L')}${ci('doc',c.doc||r.doc,'doc','L')}</div>
  ${r.note?`<p class="sub" style="margin:8px 0 0">${esc(r.note)}</p>`:''}
  ${(()=>{const km={adaptive:['mill','adaptive'],rough:['mill','rough'],slot:['mill','rough'],face:['face','face'],drill:['drill','drill'],spot:['spot','drill'],tap:['tap','drill'],ream:['ream','drill'],finish:[c.type==='ball'?'ball':'mill',c.type==='ball'?'finish':'rough']}[c.kind];const L=km&&learn(km[0],km[1],S.mat,c.dia,c.tm);if(!L)return'';const rpm=Math.min(mach().rpmMax,Math.round(L.sfm*3.82/c.dia));const Z=['drill','spot'].includes(c.kind)?2:c.fl;
   return`<div class="warn" style="margin-top:10px;background:color-mix(in srgb,#1c9b5f 12%,transparent);border-color:color-mix(in srgb,#1c9b5f 40%,transparent)"><b>${LANG==='vi'?'Dữ liệu xưởng':'Shop data'} ×${L.n}</b> · ${Math.round(L.sfm)} SFM · <b class="ro">${rpm} rpm</b> · <b class="ro">F${ffd(c.kind==='tap'?rpm*L.ipt:rpm*L.ipt*Z)}</b>${L.docR?' · DOC '+fl(L.docR*c.dia,3):''}${L.wocR?' · WOC '+fl(L.wocR*c.dia,3):''}</div>`;})()}</div></details>
${hardCard()}
 <details class="acc"><summary>${t('tapChart')}</summary><div class="scroll"><table><thead><tr><th>Tap</th><th>TPI / pitch</th><th>${LANG==='vi'?'Mũi khoan':'Drill'}</th><th class="n">in</th><th class="n">mm</th></tr></thead><tbody>
  ${C.TAPS.map(x=>`<tr><td>${x[0]}</td><td>${x[0].startsWith('M')?x[0].split('x')[1]+' mm':Math.round(1/x[2])}</td><td>${x[4]}</td><td class="n">${x[3].toFixed(4)}</td><td class="n">${(x[3]*25.4).toFixed(2)}</td></tr>`).join('')}</tbody></table></div></details>
 <details class="acc"><summary>${t('bolt')}</summary><div><div class="fields">${ci('cx',c.bc.x,'bc.x','L')}${ci('cy',c.bc.y,'bc.y','L')}${ci('bcd',c.bc.d,'bc.d','L')}${ci('count',c.bc.n,'bc.n')}${ci('start',c.bc.a,'bc.a')}${ci('holeDia',c.bc.h,'bc.h','L')}</div>
  <div class="scroll" style="margin-top:10px"><table><thead><tr><th>#</th><th class="n">X</th><th class="n">Y</th></tr></thead><tbody>${bcPts.map((p,i)=>`<tr><td>${i+1}</td><td class="n">${fl(p[0])}</td><td class="n">${fl(p[1])}</td></tr>`).join('')}</tbody></table></div>
  <button class="btn pri" style="margin-top:10px" data-act="addBolt" ${S.raw?'':'disabled'}>${IC.plus}${t('addHoles')}</button></div></details>
 <details class="acc"><summary>${t('chamCalc')}</summary><div><div class="fields">${ci('chamferSz',c.ch.c,'ch.c','L')}${ci('tipAngle',c.ch.a,'ch.a')}${ci('tipDia',c.ch.tip,'ch.tip','L')}</div>
  <div class="kpi" style="margin-top:10px"><div><span>Z</span><b>${fl(-chDepth,4)}</b></div><div><span>${LANG==='vi'?'Bù bán kính':'Tool offset'}</span><b>${fl((c.ch.tip/2)+0.0,4)}</b></div></div></div></details>
 <details class="acc"><summary>${t('conv')}</summary><div><div class="fields"><label class="f">inch<input inputmode="decimal" id="cvIn" value="${c.cv.in}"></label><label class="f">mm<input inputmode="decimal" id="cvMm" value="${(c.cv.in*25.4).toFixed(3)}"></label></div>
  <p class="sub" style="margin:10px 0 0">RPM = SFM × 3.82 ÷ D · IPM = RPM × ${LANG==='vi'?'số me':'flutes'} × IPT · ${LANG==='vi'?'Taro':'Tap'} F = RPM × ${LANG==='vi'?'bước ren':'pitch'}</p></div></details>`;
}

/* ----- hardness ----- */
// [HV, HB, HRB, HRC] approximate for steel (ASTM E140)
const HARD=[[95,90,49,null],[105,100,56,null],[126,120,67,null],[147,140,75,null],[168,160,83,null],[189,180,89,null],[210,200,93.8,null],[231,220,97,null],[252,240,100,22],[273,260,null,26],[295,280,null,29],[316,300,null,32],[370,350,null,37.5],[424,400,null,43],[480,450,null,47.5],[539,500,null,51.5],[600,550,null,55],[670,600,null,58.5],[697,null,null,60],[746,null,null,62],[832,null,null,65]];
function hardConv(v,s){const col={HV:0,HB:1,HRB:2,HRC:3}[s];const rows=HARD.filter(r=>r[col]!=null);let hv=null;
 for(let i=0;i<rows.length-1;i++){const a=rows[i],b=rows[i+1];if(v>=a[col]&&v<=b[col]){hv=a[0]+(b[0]-a[0])*(v-a[col])/(b[col]-a[col]);break;}}if(hv==null)return null;
 const at=(c)=>{const rr=HARD.filter(r=>r[c]!=null);for(let i=0;i<rr.length-1;i++){const a=rr[i],b=rr[i+1];if(hv>=a[0]&&hv<=b[0])return a[c]+(b[c]-a[c])*(hv-a[0])/(b[0]-a[0]);}return null;};
 const HB=at(1),HRB=at(2),HRC=at(3);const uts=HB?HB*0.5:hv*0.48;return{HV:hv,HB,HRB,HRC,ksi:uts,mpa:uts*6.895};}
function hardAdvice(r){const vi=LANG==='vi';const hb=r.HB||r.HV*0.95;
 if(hb<150)return vi?'Mềm (nhôm cứng, thép mềm): carbide hoặc HSS, tốc độ cao theo vật liệu.':'Soft (hard aluminum, mild steel): carbide or HSS, normal material speeds.';
 if(hb<280)return vi?'Thép thường / đã tôi nhẹ (≤ 28 HRC): carbide TiAlN, tốc độ bình thường.':'Normal / lightly hardened steel (≤ 28 HRC): carbide TiAlN, normal speeds.';
 if(hb<400)return vi?'Đã tôi trước 28–42 HRC: giảm SFM ~25–40%, AlTiN, giảm lượng ăn/răng, dao ngắn.':'Pre-hard 28–42 HRC: cut SFM ~25–40%, AlTiN, lower chip load, short tools.';
 if(hb<500)return vi?'Cứng 42–50 HRC: phay cứng — carbide hạt mịn, AlTiN/nACo, SFM ~150–250, WOC nhẹ, HSS không dùng được.':'Hard 42–50 HRC: hard milling — fine-grain carbide, AlTiN/nACo, ~150–250 SFM, light WOC, no HSS.';
 return vi?'Rất cứng > 50 HRC: dao phay cứng chuyên dụng / CBN, bước ngang rất nhẹ, hoặc mài / EDM. Không khoan hay taro được bình thường.':'Very hard > 50 HRC: dedicated hard-milling / CBN tools, very light stepover, or grind / EDM. Normal drilling and tapping will not work.';}
function hardCard(){const c=CALC.hd,r=hardConv(c.v,c.s),vi=LANG==='vi';const f=(x,d)=>x==null?'—':x.toFixed(d);
 return`<details class="acc" ${c.o?'open':''}><summary>${vi?'Độ cứng (HRC · HRB · HB · HV)':'Hardness (HRC · HRB · HB · HV)'}</summary><div>
 <div class="fields"><label class="f">${vi?'Giá trị':'Value'}<input inputmode="decimal" data-c="hd.v" data-u="N" value="${c.v}"></label><label class="f">${vi?'Thang đo':'Scale'}<select data-c="hd.s" data-u="S">${['HRC','HRB','HB','HV'].map(k=>`<option ${k===c.s?'selected':''}>${k}</option>`).join('')}</select></label></div>
 ${r?`<div class="kpi" style="margin-top:12px"><div><span>HRC</span><b>${f(r.HRC,1)}</b></div><div><span>HRB</span><b>${f(r.HRB,1)}</b></div><div><span>HB</span><b>${f(r.HB,0)}</b></div><div><span>HV</span><b>${f(r.HV,0)}</b></div><div><span>${vi?'Bền kéo':'Tensile'} ksi</span><b>${f(r.ksi,0)}</b></div><div><span>MPa</span><b>${f(r.mpa,0)}</b></div></div>
 <div class="warn" style="margin-top:10px">${esc(hardAdvice(r))}</div>`:`<p class="sub" style="color:var(--bad)">${vi?'Ngoài bảng (HRC 22–65, HRB 49–100, HB 90–600, HV 95–832).':'Out of range (HRC 22–65, HRB 49–100, HB 90–600, HV 95–832).'}</p>`}
 <svg viewBox="0 0 330 60" style="width:100%;margin-top:10px">${[['#c9ced3',0,60,vi?'Nhôm':'Al'],['#8d949a',60,140,vi?'Thép mềm':'Mild'],['#7b8187',140,210,'4140 PH'],['#e39b00',210,270,vi?'Tôi cứng':'Hard'],['#d93a3a',270,330,'60+ HRC']].map(z=>`<rect x="${z[1]}" y="10" width="${z[2]-z[1]}" height="22" fill="${z[0]}"/><text x="${(z[1]+z[2])/2}" y="48" text-anchor="middle" font-size="10" font-weight="600">${z[3]}</text>`).join('')}${r?`<path d="M${Math.max(2,Math.min(328,r.HV/832*330))} 4v32" stroke="#14181c" stroke-width="3"/>`:''}</svg>
 <p class="sub" style="margin:6px 0 0;font-size:13px">${vi?'Bảng quy đổi gần đúng cho thép (ASTM E140). Nhôm 6061-T6 ≈ 95 HB, inox 304 ≈ 150–200 HB.':'Approximate steel conversion (ASTM E140). 6061-T6 ≈ 95 HB, 304 stainless ≈ 150–200 HB.'}</p></div></details>`;}
/* ----- setup sheet ----- */
function rSetup(){
 const h=S.hdr,m=mat(),mc=mach();const used=[];S.ops.forEach(o=>{if(o.on&&!used.includes(o.tool))used.push(o.tool);});
 const zDesc={ll:['lower-left corner of part','góc dưới bên trái chi tiết'],tl:['upper-left corner of part','góc trên bên trái chi tiết'],lr:['lower-right corner of part','góc dưới bên phải chi tiết'],c:['center of part','tâm chi tiết']}[S.zero];
 const fx=S.fixture,fc=fixtureCheck();const B=(en,vi)=>`${esc(en)}<br><span class="bi">${esc(vi)}</span>`;
 const steps=[
  ['Clean the table and the '+t('vise').toLowerCase()+'; indicate the fixed jaw within 0.0005".','Vệ sinh bàn máy và đồ gá; rà hàm cố định trong 0.0005".'],
  [`Load stock ${fl(S.stock.x,3)} × ${fl(S.stock.y,3)} × ${fl(S.stock.z,3)} ${ulab()} (${m.en}) in the ${TX[fx.type][0].toLowerCase()}`+(fc?`, on ${fl(fx.parH,3)} parallels — stick-out ${fl(fc.so,3)}.`:'.'),`Kẹp phôi ${fl(S.stock.x,3)} × ${fl(S.stock.y,3)} × ${fl(S.stock.z,3)} ${ulab()} (${m.vi}) trên ${TX[fx.type][1].toLowerCase()}`+(fc?`, căn đệm ${fl(fx.parH,3)} — nhô ${fl(fc.so,3)}.`:'.')],
  ['Set X0 Y0 at the '+zDesc[0]+' with an edge finder.','Lấy X0 Y0 tại '+zDesc[1]+' bằng đầu dò cạnh.'],
  [`Set Z0 at the top of the finished part (stock top − ${fl(S.stock.face,3)}).`,`Lấy Z0 tại mặt trên chi tiết hoàn thiện (mặt phôi − ${fl(S.stock.face,3)}).`],
  ['Load the tools below and set each tool length offset.','Lắp các dao bên dưới và đo bù chiều dài từng dao.'],
  ['Dry-run the program with Z raised 1.00" and feed override low; watch the first plunge of every tool.','Chạy thử với Z nâng 1.00" và giảm feed; quan sát lần ăn xuống đầu tiên của mỗi dao.'],
  ['Run the operations in order. Check coolant and chip clearing in pockets.','Chạy các nguyên công theo thứ tự. Kiểm tra nước làm mát và thoát phoi trong hốc.'],
  ...(S.stock.z-S.stock.face-thick()>0.01?[[`Op 2: flip the part, face off the extra stock to ${fl(thick(),3)} thick.`,`Nguyên công 2: lật chi tiết, phay mặt bỏ phần phôi dư còn dày ${fl(thick(),3)}.`]]:[]),
  ['Deburr all edges, inspect critical dimensions, record on the inspection sheet.','Làm sạch bavia, đo kiểm kích thước quan trọng, ghi vào phiếu kiểm.'],
 ];
 const hf=(k,path,v)=>`<label class="f">${both(k)}<input data-b="hdr.${path}" data-u="S" value="${esc(v)}"></label>`;
 $('#main').innerHTML=`<div class="noprint"><h1>${t('setupTitle')}</h1><p class="sub">${t('setupSub')}</p>
 <div class="card" style="margin-bottom:14px"><div class="fields">${hf('partName','name',h.name)}${hf('partNo','no',h.no)}${hf('rev','rev',h.rev)}${hf('qty','qty',h.qty)}${hf('customer','cust',h.cust)}${hf('programmer','prog',h.prog)}${hf('operator','oper',h.oper)}${hf('date','date',h.date)}</div>
 <label class="f" style="margin-top:10px">${both('notes')}<textarea data-b="hdr.notes" data-u="S">${esc(h.notes)}</textarea></label>
 <div class="row" style="margin-top:10px"><button class="btn go" data-act="savePdf">${IC.save}${t('savePdf')}</button><button class="btn" data-act="saveHtml">${IC.save}${t('saveHtml')}</button><button class="btn" data-act="print">${IC.print}${t('print')}</button></div></div></div>
 <div class="ss">
  <div class="row" style="justify-content:space-between;align-items:flex-end"><div><h1>${esc(h.name||'PART')}</h1><div class="bi">SETUP SHEET / PHIẾU SETUP</div></div><div style="text-align:right;font-weight:700">${esc(h.no)} · Rev ${esc(h.rev)}</div></div>
  <div class="hdr">${[['partNo',h.no],['qty',h.qty],['customer',h.cust],['material',m.en+' / '+m.vi],['machine',mc.name],['programmer',h.prog],['operator',h.oper],['date',h.date],['cycle',Math.floor(CT/60)+':'+String(Math.round(CT%60)).padStart(2,'0')+' min']].map(([k,v])=>`<div><span>${esc(both(k))}</span><b>${esc(v)}</b></div>`).join('')}</div>
  <div class="two"><div><div class="sec">${both('zero')}</div>${partSVG({mh:300})}
   <p style="margin:6px 0">X0 Y0: ${B(zDesc[0],zDesc[1])}<br>Z0: ${B('top of finished part','mặt trên chi tiết hoàn thiện')}</p></div>
   <div><div class="sec">${both('fixtures')} — ${esc(both(fx.type))}</div>${fixtureSVG(fx.type)}
   ${fc?`<p style="margin:6px 0">${both('stickout')}: <b>${fl(fc.so,3)}</b> · ${both('deep')}: <b>${fl(fc.deep,3)}</b></p>`:''}${fx.notes?`<p>${esc(fx.notes)}</p>`:''}</div></div>
  ${S.ref?`<div class="sec">${both('refImg')}</div><img src="${S.ref}" style="max-width:100%;max-height:300px">`:''}
  <div class="sec">${both('tools')}</div>
  <div class="scroll"><table><thead><tr><th></th><th>T#</th><th>${B('Description','Mô tả')}</th><th class="n">Ø</th><th class="n">${B('Flutes','Me')}</th><th class="n">LOC</th><th>${B('Notes','Ghi chú')}</th></tr></thead><tbody>
  ${used.map(id=>{const x=toolById(id);return`<tr><td style="width:44px;height:64px;padding:2px">${toolSVG(x).replace('<svg','<svg style="height:60px;width:40px"')}</td><td><b>T${x.num}</b></td><td>${esc(x.desc)}</td><td class="n">${fl(x.dia)}</td><td class="n">${x.flutes}</td><td class="n">${fl(x.loc,3)}</td><td>${x.mat==='hss'?'HSS':'Carbide'} ${x.coat&&x.coat!=='none'?esc(x.coat):''}</td></tr>`;}).join('')}</tbody></table></div>
  <div class="sec">${both('ops')}</div>
  <div class="scroll"><table><thead><tr><th>#</th><th>${B('Operation','Nguyên công')}</th><th>T#</th><th class="n">RPM</th><th class="n">${B('Feed','Bước tiến')}</th><th class="n">DOC</th><th class="n">WOC</th><th class="n">Z</th></tr></thead><tbody>
  ${S.ops.map((o,i)=>o.on?`<tr><td>${i+1}</td><td>${B(((TX[{face:'face_',pocket:'pocket_',slot:'slot_'}[o.type]||o.type]||[o.type])[0])+' — '+featLabelX(o,'en'),((TX[{face:'face_',pocket:'pocket_',slot:'slot_'}[o.type]||o.type]||[0,o.type])[1])+' — '+featLabelX(o,'vi'))}</td><td>T${toolById(o.tool)?.num}</td><td class="n">${o.rpm}</td><td class="n">${ffd(o.feed)}</td><td class="n">${['face','adaptive','pocket','contour','slot','circ'].includes(o.type)?fl(o.doc,3):''}</td><td class="n">${['face','adaptive','pocket','slot','circ'].includes(o.type)?fl(o.woc,3):''}</td><td class="n">${fl(o.zBot,3)}</td></tr>`:'').join('')}</tbody></table></div>
  <div class="sec">INSTRUCTIONS / HƯỚNG DẪN</div><ol>${steps.map(s=>`<li>${B(s[0],s[1])}</li>`).join('')}</ol>
  ${h.notes?`<div class="sec">${both('notes')}</div><p style="white-space:pre-wrap">${esc(h.notes)}</p>`:''}
  <p style="margin:14px 0 0;font-size:11px;color:#666">MINI CAM · ${esc(both('createdBy'))} · © 2026 Ryan Nguyen. ${LANG==='vi'?'Kiểm tra chương trình trước khi chạy.':'Verify the program before running.'}</p>
  <div class="hdr" style="margin-top:18px"><div><span>${both('operator')} — sign / ký</span><b>&nbsp;</b></div><div><span>${both('programmer')} — sign / ký</span><b>&nbsp;</b></div><div><span>QC — sign / ký</span><b>&nbsp;</b></div></div>
 </div>`;
}
function featLabelX(o,l){const f=featById(o.feat);if(!f)return l==='en'?'stock top':'mặt phôi';const nm={profile:['outside profile','biên ngoài'],pocket:['pocket','hốc'],holes:['holes','lỗ'],slot:['slot','rãnh']}[f.kind][l==='en'?0:1];return f.kind==='holes'?nm+' Ø'+fl(f.dia,3)+' ×'+f.pts.length+(f.tap?' ('+f.tap+')':''):nm+' '+f.id;}

/* ================= events ================= */
function setPath(obj,path,v){const ks=path.split('.');let o=obj;for(let i=0;i<ks.length-1;i++)o=o[ks[i]];o[ks[ks.length-1]]=v;}
function parseVal(el){const u=el.dataset.u;if(u==='S'||el.tagName==='SELECT'&&u!=='L'&&u!=='N')return el.value;const n=parseFloat(String(el.value).replace(',','.'));if(isNaN(n))return null;if(u==='L'||u==='F')return n/K();if(u==='P')return Math.max(0.1,Math.min(1,n/100));return n;}
document.addEventListener('change',e=>{
 const el=e.target;
 if(el.id==='selMat'){S.mat=el.value;S.ops.forEach(o=>o.auto&&applyFeeds(o));buildProgram();render();return;}
 if(el.id==='selMachine'){S.machine=el.value;S.post=mach().post||'prototrak';if(!mach().rot)S.rotary='none';S.ops.forEach(o=>o.auto&&applyFeeds(o));buildProgram();render();return;}
 if(el.id==='postSel'){S.post=el.value;if(mach().type==='lathe'){rLathe();return;}regen();return;}if(el.id==='tsChk'){S.toolStop=el.checked;regen();return;}if(el.id==='lnChk'){S.lineNums=el.checked;regen();return;}
 if(el.id==='rotSel'){S.rotary=el.value;regen();setTimeout(()=>rProgram(),200);return;}
 if(el.dataset.defsw){S.def={...DEF0,...(S.def||{})};S.def[el.dataset.defsw]=el.checked;autoProgram();buildProgram();rProgram();return;}
 if(el.dataset.nb){S.nest[el.dataset.nb]=el.dataset.u==='S'?el.value:parseVal(el);if(el.dataset.nb==='mode'&&el.value==='twoSide'&&S.nest.tabT<0.06)S.nest.tabT=0.06;persist();rNest();return;}
 if(el.dataset.ni!=null){const it=S.nest.items[+el.dataset.ni];it[el.dataset.k]=el.dataset.k==='qty'?Math.max(0,parseInt(el.value)||0):el.value;persist();rNest();return;}
 if(el.dataset.lb){S.lathe[el.dataset.lb]=parseVal(el);persist();rLathe();return;}
 if(el.dataset.lo!=null){const o=S.lathe.ops[+el.dataset.lo];const v2=el.dataset.u==='S'?el.value:parseVal(el);o[el.dataset.k]=el.dataset.k==='tool'?+el.value:v2;persist();rLathe();return;}
 if(el.dataset.lon!=null){S.lathe.ops[+el.dataset.lon].on=el.checked;persist();rLathe();return;}
 if(el.dataset.lt!=null){const x=S.ltools[+el.dataset.lt];x[el.dataset.k]=el.dataset.u==='S'?el.value:parseVal(el);persist();rTools();return;}
 if(el.dataset.setsw){SETS()[el.dataset.setsw]=el.checked;persist();applySettings();if(S.tab==='settings')rSettings();return;}
 if(el.dataset.sb){SETS()[el.dataset.sb]=parseVal(el);persist();buildProgram();return;}
 if(el.id==='uiScale'){SETS().uiScale=+el.value;persist();applySettings();rSettings();return;}
 if(el.id==='postSel2'){S.post=el.value;buildProgram();persist();return;}
 if(el.id==='extSel'){S.ext=el.value;persist();return;}
 if(el.id==='pdfSc'){S.pdfScale=parseFloat(el.value)||1;persist();return;}
 if(el.id==='parAuto'){S.fixture.parAuto=el.checked;buildProgram();rFixtures();return;}
 if(el.id==='simSpeed'){SIMSTATE.speed=+el.value;return;}
 if(el.id==='simScrub'){SIMSTATE.playing=false;updPlay();simJump(+el.value);return;}
 if(el.id==='cvIn'){CALC.cv.in=parseFloat(el.value)||0;$('#cvMm').value=(CALC.cv.in*25.4).toFixed(3);return;}
 if(el.id==='cvMm'){CALC.cv.in=(parseFloat(el.value)||0)/25.4;$('#cvIn').value=CALC.cv.in.toFixed(4);return;}
 if(el.dataset.on){const o=S.ops.find(x=>x.id===el.dataset.on);o.on=el.checked;regen();return;}
 if(el.dataset.auto){const o=S.ops.find(x=>x.id===el.dataset.auto);o.auto=el.checked;if(o.auto)applyFeeds(o);regen();return;}
 const v=parseVal(el);if(v===null){if(el.dataset.op&&['a','b','c'].includes(el.dataset.k)&&!el.value.trim()){S.ops.find(x=>x.id===el.dataset.op)[el.dataset.k]=null;regen();}return;}
 if(el.dataset.b){setPath(S,el.dataset.b,v);if(el.dataset.b==='fixture.parH')S.fixture.parAuto=false;if(el.dataset.b==='stock.part'||el.dataset.b.startsWith('def.')){S.def={...DEF0,...(S.def||{})};if(el.dataset.b.startsWith('def.'))S.def[el.dataset.b.slice(4)]=v;autoProgram();}if(el.dataset.b.startsWith('stock')){S.ops.forEach(o=>{});}buildProgram();if(S.tab==='fixtures')rFixtures();else if(S.tab==='program'){VIEW.fitted=false;fitView();renderOps();renderCode();drawView();}else persist();return;}
 if(el.dataset.op){const o=S.ops.find(x=>x.id===el.dataset.op);let k=el.dataset.k;if(k==='type'||k==='cycle')OPEN.add(o.id);if(k==='chamferSz'){o.chamfer=v;o.zBot=-v;}else o[k]=v;
  if(['type','tool','feat','zBot','zTop'].includes(k)&&o.auto)applyFeeds(o);if(['rpm','feed','plunge'].includes(k))o.auto=false;if(['doc','woc'].includes(k))o.docFix=true;regen();if(['type','cycle','rings'].includes(k))setTimeout(renderOps,180);return;}
 if(el.dataset.tl){const x=toolById(el.dataset.tl);x[el.dataset.k]=el.dataset.k==='num'||el.dataset.k==='flutes'?Math.round(v):v;$('#tlPic').innerHTML=toolSVG(x,{dims:true});S.ops.forEach(o=>o.tool===x.id&&o.auto&&applyFeeds(o));buildProgram();if(el.dataset.k==='type')editTool(x.id);return;}
 if(el.dataset.c){if(el.dataset.c.startsWith('hd'))CALC.hd.o=1;setPath(CALC,el.dataset.c,v);rCalc();const d=$$('details.acc');return;}
});
document.addEventListener('click',e=>{
 if(e.target.closest('.sw'))return;
 const b=e.target.closest('button,[data-tog],[data-simop]');if(!b)return;const d=b.dataset;
 if(d.tab){S.tab=d.tab;render();persist();return;}
 if(d.l){LANG=d.l;try{localStorage.setItem('trakLang',LANG);}catch(_){}render();return;}
 if(d.u){S.units=d.u;render();return;}
 if(d.z){S.zero=d.z;applyZero();buildProgram();VIEW.fitted=false;rProgram();return;}
 if(d.tog){const id=d.tog;OPEN.has(id)?OPEN.delete(id):OPEN.add(id);renderOps();return;}
 if(d.mv){const i=S.ops.findIndex(o=>o.id===d.mv),j=i+(+d.d);if(j<0||j>=S.ops.length)return;[S.ops[i],S.ops[j]]=[S.ops[j],S.ops[i]];regen();renderOps();return;}
 if(d.del){S.ops=S.ops.filter(o=>o.id!==d.del);regen();renderOps();return;}
 if(d.pv){VIEW.mode=d.pv;$$('#pvMode button').forEach(x=>x.classList.toggle('on',x.dataset.pv===d.pv));const sub=$('#pv')?.parentElement.querySelector('.card .sub');drawView();return;}
 if(d.nidel!=null){S.nest.items.splice(+d.nidel,1);rNest();return;}
 if(d.lsrc){S.lathe.src=d.lsrc;persist();rLathe();return;}
 if(d.set){SETS()[d.set]=d.v;persist();applySettings();rSettings();setTimeout(()=>{drawView&&drawView();},50);return;}
 if(d.hq){S._hq=d.hq;rHelp();return;}
 if(d.mi){S._mi=d.mi;S.tab==='mat'?rMat():rLearn();if(S.tab==='mat'){const el=$('#matDet');el&&window.scrollTo({top:el.getBoundingClientRect().top+scrollY-200,behavior:'smooth'});}return;}
 if(d.lmgo){S._lm=d.lmgo;S._la={};S.tab='learn';render();return;}
 if(d.usemat){S.mat=d.usemat;S.ops.forEach(o=>o.auto&&applyFeeds(o));buildProgram();render();toast(LANG==='vi'?'Đã chọn vật liệu':'Material selected');return;}
 if(d.lm!=null){S._lm=d.lm||null;S._la={};rLearn();window.scrollTo(0,0);return;}
 if(d.lq!=null){const m=LEARN.find(x=>x.id===S._lm);S._la=S._la||{};S._la[+d.lq]=+d.lo2;const n=Object.keys(S._la).length;if(n===m.quiz.length){const sc=m.quiz.filter((q,i)=>S._la[i]===q[2]).length;S.learnP=S.learnP||{};S.learnP[m.id]={score:sc,pass:sc===m.quiz.length};persist();}rLearn();return;}
 if(d.feat){S.excl=S.excl||[];const i=S.excl.indexOf(d.feat);i<0?S.excl.push(d.feat):S.excl.splice(i,1);autoProgram();buildProgram();rProgram();return;}
 if(d.tool){editTool(d.tool);return;}
 if(d.deltool){S.tools=S.tools.filter(x=>x.id!==d.deltool);closeSheet();buildProgram();return;}
 if(d.fx){S.fixture.type=d.fx;if(d.fx==='softjaw'&&S.fixture.parH>0)S.fixture.parH=0;rFixtures();persist();return;}
 if(d.m){SIMSTATE.mode=d.m;$$('#simMode button').forEach(x=>x.classList.toggle('on',x.dataset.m===d.m));simDraw();return;}
 if(d.ax){SIMSTATE.axis=d.ax;SIMSTATE.playing=false;SIM=null;SIMSTATE.dirty=true;rSim();return;}
 if(d.zm){SIMSTATE.zoom*=+d.zm;simDraw();return;}
 if(d.shw){SIMSTATE.sh[d.shw]=SIMSTATE.sh[d.shw]?0:1;const pl=SIMSTATE.playing;rSim();if(pl){SIMSTATE.playing=true;updPlay();simLast=0;simRAF=requestAnimationFrame(simLoop);}return;}
 if(d.vca){const D=Math.PI/12;const A={up:[0,-D],dn:[0,D],lf:[D,0],rt:[-D,0],ccw:[Math.PI/2,0],cw:[-Math.PI/2,0]}[d.vca];if(d.vca==='fit'){viewTo(SIMSTATE.yaw,SIMSTATE.pitch,1);}else if(d.vca==='home'){viewTo(-0.785,0.96,1);}else viewTo(SIMSTATE.yaw+A[0],Math.max(0,Math.min(Math.PI/2,SIMSTATE.pitch+A[1])));return;}
 if(d.simto!=null){const oi=+d.simto,c=CS(),st=c.findIndex(q=>q[9]===oi),en=opEnd(oi);if(SIM.i>=en||SIM.done){simInit();}SIMSTATE.stopAt=oi;rSimOpsMark();SIMSTATE.playing=true;updPlay();simLast=0;cancelAnimationFrame(simRAF);simRAF=requestAnimationFrame(simLoop);$('#sv').scrollIntoView({behavior:'smooth',block:'start'});return;}
 if(d.sv){const V={fit:null,iso:[-0.785,0.96],top:[0,0.05],front:[0,1.45],side:[-Math.PI/2,1.45]}[d.sv];SIMSTATE.zoom=1;if(V){SIMSTATE.mode='3d';SIMSTATE.yaw=V[0];SIMSTATE.pitch=V[1];$$('#simMode button').forEach(b=>b.classList.toggle('on',b.dataset.m==='3d'));}simDraw();return;}
 if(d.sc){SIMSTATE.color=d.sc;$$('#simColor button').forEach(x=>x.classList.toggle('on',x.dataset.sc===d.sc));simLegend();simDraw();return;}
 if(d.simop!==undefined){const k=CS().findIndex(s=>s[9]===+d.simop);SIMSTATE.playing=false;updPlay();simJump(Math.max(0,k));$('#sv').scrollIntoView({behavior:'smooth',block:'start'});return;}
 if(b.id==='lPlay'){if(!LSIM)return;if(LSIM.k>=S.lathe.segs.length){LSIM.k=0;LSIM.r.fill(S.lathe.stockD/2);}LSIM.playing=!LSIM.playing;b.innerHTML=LSIM.playing?IC.pause+t('pause'):IC.play+t('play');if(LSIM.playing)requestAnimationFrame(LSIM.loop);return;}
 if(b.id==='simPlay'){if(SIM.done)simInit();SIMSTATE.playing=!SIMSTATE.playing;updPlay();if(SIMSTATE.playing){simLast=0;simRAF=requestAnimationFrame(simLoop);}else simDraw();return;}
 switch(d.act){
  case'import':$('#fileDxf').click();break;
  case'img':$('#fileImg').click();break;
  case'demo':WARN=[];S.meshT=null;importDXF(demoDXF(),'demo-bracket.dxf','in');S.src='dxf';S.excl=[];buildProgram();VIEW.fitted=false;rProgram();break;
  case'fit':fitView();drawView();break;
  case'zIn':case'zOut':{if(VIEW.mode==='3d'){VIEW.z3*=d.act==='zIn'?1.25:0.8;drawView();break;}const cv=$('#pvc'),r=cv.getBoundingClientRect();zoomAt(r.left+r.width/2,r.top+r.height/2,d.act==='zIn'?1.3:1/1.3);drawView();break;}
  case'togglePaths':VIEW.paths=!VIEW.paths;b.style.color=VIEW.paths?'var(--blue)':'';drawView();break;
  case'auto':autoProgram();buildProgram();rProgram();break;
  case'addOp':{const f=S.feats.find(x=>x.kind!=='holes')||S.feats[0];const tl=findTool(x=>x.type==='flat');if(!tl)break;const o=newOp(f&&f.kind==='holes'?'drill':'contour',f?f.id:null,tl.id,{zBot:-0.25});S.ops.push(o);OPEN.add(o.id);regen();renderOps();break;}
  case'copyG':copyText(GCODE);break;
  case'saveG':{const ext=S.ext||'gcd',base=(S.hdr.name||'PART').toUpperCase().replace(/[^A-Z0-9_-]/g,'').slice(0,20)||'PART';const body=GCODE.replace(/\n/g,'\r\n');
   if(ext==='txt')saveFile(base+'.txt',body);else saveFile(base+'.zip',makeZip([{name:base+'.'+ext,data:new TextEncoder().encode(body)}]),true);break;}
  case'stl':exportSTL();break;
  case'simEach':SIMSTATE.stopEach=!SIMSTATE.stopEach;rSim();break;
  case'simClrStop':SIMSTATE.stopAt=null;rSim();break;
  case'lqReset':S._la={};rLearn();break;
  case'projSave':{const j=JSON.stringify({miniCamProject:1,...S,ref:S.ref,meshT:null,_hm:null,cylMap:null});saveFile(((S.hdr.name||'project').replace(/[^\w-]/g,'_'))+'.json',j);break;}
  case'resetAll':if(b.dataset.armed){try{localStorage.clear();}catch(_){}location.reload();}else{b.dataset.armed=1;b.innerHTML=IC.del+t('resetConfirm');setTimeout(()=>{delete b.dataset.armed;if(b.isConnected)b.innerHTML=IC.del+t('resetAll');},3000);}break;
  case'lSave':{const L=S.lathe,base=(S.hdr.name||'SHAFT').toUpperCase().replace(/[^A-Z0-9_-]/g,'');const ext=S.post==='siemens'?'mpf':(S.ext||'nc');saveFile(base+'.zip',makeZip([{name:base+'.'+ext,data:new TextEncoder().encode(L.gcode.replace(/\n/g,'\r\n'))}]),true);break;}
  case'lCopy':copyText(S.lathe.gcode);break;
  case'lAdd':{const ty=$('#lAddSel').value;S.lathe.ops.push({type:ty,tool:{lface:1,lrough:1,lfinish:2,lgroove:3,lthread:4,ldrill:5,lpart:6}[ty],on:true,doc:0.06,leaveX:0.01,zPos:-0.5,width:0.125,dia:0.9,peckX:0.05,pitch:0.05,zEnd:-0.75,passes:8,depth:0.5,peck:0.15});rLathe();break;}
  case'lReset':if(LSIM){LSIM.playing=false;LSIM.k=0;LSIM.r.fill(S.lathe.stockD/2);latheDraw($('#lcv'),0);}break;
  case'nestAdd':S.nest.items.push({src:'plate',qty:1});rNest();break;
  case'nestCopy':copyText(NESTG);break;
  case'nestSave':{const base=((S.hdr.name||'NEST')+'_NEST').toUpperCase().replace(/[^A-Z0-9_-]/g,'');const ext=S.ext||'gcd';const body=NESTG.replace(/\n/g,'\r\n');if(ext==='txt')saveFile(base+'.txt',body);else saveFile(base+'.zip',makeZip([{name:base+'.'+ext,data:new TextEncoder().encode(body)}]),true);break;}
  case'savePdf':setupPDF();break;
  case'saveHtml':saveFile(((S.hdr.name||'PART')+'-setup').replace(/[^\w-]/g,'_')+'.html',setupHTML());break;
  case'addTool':{const x={id:nid('t'),num:Math.max(0,...S.tools.map(x=>x.num))+1,type:'flat',desc:'New end mill',dia:0.25,flutes:3,mat:'carbide',coat:'none',loc:0.75,oal:2.5};S.tools.push(x);editTool(x.id);break;}
  case'closeSheet':closeSheet();persist();break;
  case'importJson':$('#fileJson').click();break;
  case'exportJson':copyText(JSON.stringify({tools:S.tools.map(({id,...r})=>r)},null,1));break;
  case'simHD':{SIMSTATE.hd=!SIMSTATE.hd;b.classList.toggle('pri',SIMSTATE.hd);const at=SIM?SIM.i:0;simJump(at);break;}
  case'simReset':SIMSTATE.playing=false;updPlay();simInit();simDraw();break;
  case'simNext':{const cur=CS()[SIM.i]?CS()[SIM.i][9]:-1;let k=CS().findIndex((s,i)=>i>SIM.i&&s[9]!==cur);if(k<0)k=CS().length;SIMSTATE.playing=false;updPlay();const t0=SIM.i;while(SIM.i<k){const s=SEGS[SIM.i];simAdvance(Math.hypot(s[3]-s[0],s[4]-s[1],s[5]-s[2])*(1-SIM.u)+1e-9);}simDraw();break;}
  case'addBolt':{const c=CALC.bc;for(let i=0;i<c.n;i++){const a=(c.a+360*i/c.n)*Math.PI/180;S.raw.circles.push({x:0,y:0,r:c.h/2,_p:[c.x+c.d/2*Math.cos(a),c.y+c.d/2*Math.sin(a)]});}
   // bolt-circle coordinates are in program coords: convert back to raw coords
   const b=C.geomBox(S.raw);let dx,dy;if(S.zero==='ll'){dx=-b[0];dy=-b[1];}else if(S.zero==='tl'){dx=-b[0];dy=-b[3];}else if(S.zero==='lr'){dx=-b[2];dy=-b[1];}else{dx=-(b[0]+b[2])/2;dy=-(b[1]+b[3])/2;}
   S.raw.circles.forEach(q=>{if(q._p){q.x=q._p[0]-dx;q.y=q._p[1]-dy;delete q._p;}});applyZero();autoProgram();buildProgram();toast(t('imported'));break;}
  case'print':try{window.print();}catch(_){toast(t('printFail'));}setTimeout(()=>toast(t('printFail')),400);break;
 }
});
$('#sheet').addEventListener('click',e=>{if(e.target.id==='sheet'){closeSheet();persist();}});
$('#fileDxf').addEventListener('change',async e=>{const f=e.target.files[0];if(!f)return;e.target.value='';const ext=(f.name.split('.').pop()||'').toLowerCase();const uSel=$('#dxfU')?.value||'auto';WARN=[];
 try{
  if(ext==='dwg'){toast('DWG → DXF');WARN=[t('dwgNote')];}
  else if(/^image\//.test(f.type)||['jpg','jpeg','png','heic','webp'].includes(ext)){$('#fileImg').files;setRef(f);return;}
  else if(ext==='stl'){toast('STL…');const T=C.parseSTL(await f.arrayBuffer());const M=C.meshLevels(T,1e-3);S.meshT=T;importMesh(M,f.name,uSel,null);}
  else if(ext==='step'||ext==='stp'){toast('STEP…');S.meshT=null;const txt=await f.text();const M=C.parseSTEP(txt,1e-3);if(!M.levels.length)throw new Error('no flat faces found');importMesh(M,f.name,uSel,M.unit);}
  else if(ext==='pdf'){toast('PDF…');S.meshT=null;await importPDF(await f.arrayBuffer(),f.name);}
  else{S.meshT=null;importDXF(await f.text(),f.name,uSel);S.src='dxf';}
  buildProgram();
 }catch(err){WARN.push(f.name+': '+err.message);}
 VIEW.fitted=false;S.tab='program';render();});
function setRef(f){const r=new FileReader();r.onload=()=>{const im=new Image();im.onload=()=>{const c=document.createElement('canvas'),sc=Math.min(1,1400/Math.max(im.width,im.height));c.width=im.width*sc;c.height=im.height*sc;c.getContext('2d').drawImage(im,0,0,c.width,c.height);S.ref=c.toDataURL('image/jpeg',0.85);render();};im.src=r.result;};r.readAsDataURL(f);}
function finishImport(name){S.dxfName=name;S.excl=[];const bb=C.geomBox(S.raw);S.stock.x=+(bb[2]-bb[0]+0.25).toFixed(3);S.stock.y=+(bb[3]-bb[1]+0.25).toFixed(3);applyZero();autoProgram();toast(t('imported')+': '+S.feats.length+' '+t('features').toLowerCase());}
function importMesh(M,name,uSel,unit){
 const g=C.levelsTo25D(M,1e-3);if(!g)throw new Error('no top face');
 const b=C.geomBox(g),ext=Math.max(b[2]-b[0],b[3]-b[1]);let u=uSel!=='auto'?uSel:unit||(ext>40?'mm':'in');const sc=u==='mm'?1/25.4:u==='m'?39.37:1;
 S.raw=C.scaleGeom(g,sc,0,0);S.src='mesh';S.meshInfo={sc,zTop:Math.max(...M.levels.map(l=>l.z))};S._hm=null;S.cylMap=null;S.stock.part=+(g.thick*sc).toFixed(4);
 finishImport(name);if(g.ignored)WARN.push(g.ignored+' '+t('ignoredFaces'));}
function loadScript(src){return new Promise((ok,no)=>{const s=document.createElement('script');s.src=src;s.onload=ok;s.onerror=()=>no(new Error('cannot load '+src));document.head.appendChild(s);});}
async function loadPDFjs(){if(window.pdfjsLib)return;const B='https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/';await loadScript(B+'pdf.worker.min.js');await loadScript(B+'pdf.min.js');window.pdfjsLib.GlobalWorkerOptions.workerSrc=B+'pdf.worker.min.js';}
async function importPDF(buf,name){
 await loadPDFjs();const L=window.pdfjsLib,doc=await L.getDocument({data:new Uint8Array(buf),isEvalSupported:false}).promise,page=await doc.getPage(1);
 const vp=page.getViewport({scale:2}),cv=document.createElement('canvas');cv.width=vp.width;cv.height=vp.height;const cx=cv.getContext('2d');cx.fillStyle='#fff';cx.fillRect(0,0,cv.width,cv.height);await page.render({canvasContext:cx,viewport:vp}).promise;S.ref=cv.toDataURL('image/jpeg',0.8);
 const ol=await page.getOperatorList(),O=L.OPS,sc=(S.pdfScale||1)/72;let m=[1,0,0,1,0,0];const st=[];const mul=(a,b)=>[a[0]*b[0]+a[2]*b[1],a[1]*b[0]+a[3]*b[1],a[0]*b[2]+a[2]*b[3],a[1]*b[2]+a[3]*b[3],a[0]*b[4]+a[2]*b[5]+a[4],a[1]*b[4]+a[3]*b[5]+a[5]];
 const P=(x,y)=>[(m[0]*x+m[2]*y+m[4])*sc,(m[1]*x+m[3]*y+m[5])*sc];const pieces=[];let cur=null,last=[0,0];
 const flush=c=>{if(cur&&cur.length>1)pieces.push({pts:cur,closed:!!c});cur=null;};
 const bez=(p0,p1,p2,p3)=>{for(let i=1;i<=10;i++){const t_=i/10,u=1-t_;const x=u*u*u*p0[0]+3*u*u*t_*p1[0]+3*u*t_*t_*p2[0]+t_*t_*t_*p3[0],y=u*u*u*p0[1]+3*u*u*t_*p1[1]+3*u*t_*t_*p2[1]+t_*t_*t_*p3[1];cur.push([x,y]);}};
 for(let i=0;i<ol.fnArray.length;i++){const fn=ol.fnArray[i],a=ol.argsArray[i];
  if(fn===O.save)st.push(m.slice());else if(fn===O.restore){m=st.pop()||[1,0,0,1,0,0];}else if(fn===O.transform)m=mul(m,a);
  else if(fn===O.paintFormXObjectBegin){st.push(m.slice());if(a&&a[0])m=mul(m,a[0]);}else if(fn===O.paintFormXObjectEnd){m=st.pop()||m;}
  else if(fn===O.constructPath){const ops=a[0],c=a[1];let k=0;
   for(const op of ops){
    if(op===O.moveTo){flush();last=P(c[k],c[k+1]);cur=[last];k+=2;}
    else if(op===O.lineTo){if(!cur)cur=[last];last=P(c[k],c[k+1]);cur.push(last);k+=2;}
    else if(op===O.curveTo){if(!cur)cur=[last];const p1=P(c[k],c[k+1]),p2=P(c[k+2],c[k+3]),p3=P(c[k+4],c[k+5]);bez(last,p1,p2,p3);last=p3;k+=6;}
    else if(op===O.curveTo2){if(!cur)cur=[last];const p2=P(c[k],c[k+1]),p3=P(c[k+2],c[k+3]);bez(last,last,p2,p3);last=p3;k+=4;}
    else if(op===O.curveTo3){if(!cur)cur=[last];const p1=P(c[k],c[k+1]),p3=P(c[k+2],c[k+3]);bez(last,p1,p3,p3);last=p3;k+=4;}
    else if(op===O.closePath){if(cur&&cur.length>2&&C.dist(cur[0],cur[cur.length-1])<1e-6)cur.pop();flush(true);}
    else if(op===O.rectangle){flush();const x=c[k],y=c[k+1],w=c[k+2],h=c[k+3];pieces.push({pts:[P(x,y),P(x+w,y),P(x+w,y+h),P(x,y+h)],closed:true});k+=4;}}
   flush();}}
 if(!pieces.length)throw new Error(LANG==='vi'?'PDF không có nét vector (có thể là bản scan) — đã gắn làm hình tham khảo':'no vector lines (scanned?) — kept as reference image');
 const g=C.buildGeom({pieces,circles:[]},0.0005);const v=page.view,pw=(v[2]-v[0])*sc,ph=(v[3]-v[1])*sc;
 let loops=g.loops.filter(p=>{const b=C.bbox(p);return(b[2]-b[0])<pw*0.8&&(b[3]-b[1])<ph*0.8&&Math.max(b[2]-b[0],b[3]-b[1])>0.02;});
 let circles=g.circles.filter(c=>c.r>0.01&&c.r<Math.min(pw,ph)*0.4);
 if(loops.length){const big=loops.reduce((a,b)=>Math.abs(C.area(b))>Math.abs(C.area(a))?b:a);const bb=C.bbox(big),e=0.01;const inside=q=>q[0]>=bb[0]-e&&q[0]<=bb[2]+e&&q[1]>=bb[1]-e&&q[1]<=bb[3]+e;
  const bigCircle=circles.reduce((a,c)=>!a||c.r>a.r?c:a,null);if(!(bigCircle&&Math.PI*bigCircle.r**2>Math.abs(C.area(big)))){loops=loops.filter(p=>p.every(inside));circles=circles.filter(c=>inside([c.x-c.r,c.y-c.r])&&inside([c.x+c.r,c.y+c.r]));}}
 S.raw={loops,circles,opens:[]};S.src='pdf';finishImport(name);}
$('#fileImg').addEventListener('change',e=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=()=>{const im=new Image();im.onload=()=>{const c=document.createElement('canvas'),s=Math.min(1,1400/Math.max(im.width,im.height));c.width=im.width*s;c.height=im.height*s;c.getContext('2d').drawImage(im,0,0,c.width,c.height);S.ref=c.toDataURL('image/jpeg',0.85);render();};im.src=r.result;};r.readAsDataURL(f);e.target.value='';});
$('#fileJson').addEventListener('change',async e=>{const f=e.target.files[0];if(!f)return;let j;try{j=JSON.parse(await f.text());}catch(_){toast(t('jsonBad'));return;}e.target.value='';
 const n=importJSON(j);toast(n?t('jsonOk')+': '+n:t('jsonBad'));if(n){buildProgram();render();}});
function importJSON(j){if(j&&j.autocam_lessons&&Array.isArray(j.samples)){const base=new Set(((window.MINI_LESSONS||{}).samples||[]).map(s=>JSON.stringify(s)));const add=j.samples.filter(s=>!base.has(JSON.stringify(s)));S.extraLessons=(S.extraLessons||[]).concat(add);S.ops.forEach(o=>o.auto&&applyFeeds(o));return add.length||j.samples.length;}if(j&&j.miniCamProject){delete j.miniCamProject;Object.assign(S,j);if(S.raw)applyZero();return 1;}
 const tmap={'flat end mill':'flat','ball end mill':'ball','bull nose end mill':'bull','face mill':'face','drill':'drill','spot drill':'spot','center drill':'spot','chamfer mill':'chamfer','tap right hand':'tap','tap left hand':'tap','reamer':'reamer','boring bar':'boring','radius mill':'cornerround','counter sink':'chamfer'};
 let n=0;const arr=Array.isArray(j)?j:Array.isArray(j.data)?j.data:Array.isArray(j.tools)?j.tools:Array.isArray(j.materials)?j.materials:null;if(!arr)return 0;
 for(const x of arr){
  if(x.geometry){const g=x.geometry,sc=/milli/i.test(x.unit||'')?1/25.4:1,ty=tmap[(x.type||'').toLowerCase()];if(!ty)continue;
   S.tools.push({id:nid('t'),num:(x['post-process']&&x['post-process'].number)||S.tools.length+1,type:ty,desc:x.description||x['product-id']||ty,dia:(g.DC||0.25)*sc,flutes:g.NOF||2,mat:/hss|high speed/i.test(x.BMC||'')?'hss':'carbide',coat:'none',loc:(g.LCF||g.LB||1)*sc,oal:(g.OAL||3)*sc,cornerR:(g.RE||0)*sc,tipAngle:g.SIG||(ty==='drill'?118:90),tipDia:(g['tip-diameter']||0)*sc,pitch:g.TP?g.TP*sc:(g['thread-pitch']||0.05)*sc});n++;continue;}
  if(x.sfm||x.sfmC||x.SFM){const id=x.id||String(x.name||x.en||'mat'+n).toLowerCase().replace(/\W+/g,'');const base=C.MATERIALS.find(m=>m.id===id)||{...C.MATERIALS[5],id};Object.assign(base,{en:x.name||x.en||base.en,vi:x.vi||x.name||base.vi,sfmC:x.sfmC||x.sfm||x.SFM||base.sfmC,sfmH:x.sfmH||(x.sfm||x.SFM||base.sfmC)*0.3,cl:x.cl||x.chipload||base.cl});if(!C.MATERIALS.includes(base))C.MATERIALS.push(base);n++;continue;}
  const dia=x.dia??x.diameter??x.D;if(dia){S.tools.push({id:nid('t'),num:x.num??x.number??S.tools.length+1,type:x.type&&tmap[x.type.toLowerCase()]||x.type||'flat',desc:x.desc||x.description||x.name||'tool',dia:+dia,flutes:x.flutes||x.z||2,mat:x.mat||'carbide',coat:x.coat||'none',loc:x.loc||x.fluteLength||dia*3,oal:x.oal||x.length||dia*8,cornerR:x.cornerR||0,tipAngle:x.tipAngle||118,tipDia:x.tipDia||0,pitch:x.pitch||0.05});n++;}
 }
 return n;
}

/* ================= SHOP DATA (learned lessons) ================= */
function lessons(){const base=(window.MINI_LESSONS&&window.MINI_LESSONS.samples)||[];return base.concat(S.extraLessons||[]);}
function matKey(m){m=String(m||'').toUpperCase();const fam=/ALUM/.test(m)?'AL':/STAIN|SS ?3|17-4/.test(m)?'SS':/STEEL|1018|4140|4340|1045|12L14/.test(m)?'ST':/TITAN/.test(m)?'TI':/BRASS|BRONZE|COPPER/.test(m)?'CU':'?';
 const id=/6061/.test(m)?'al6061':/7075/.test(m)?'al7075':/2024/.test(m)?'al2024':/5052/.test(m)?'al5052':/1018/.test(m)?'s1018':/4140/.test(m)?'s4140':/4340/.test(m)?'s4340':/1045/.test(m)?'s1045':/12L14/.test(m)?'s12l14':/304/.test(m)?'ss304':/316/.test(m)?'ss316':null;return{fam,id};}
const MATFAM=id=>/^al|mic6/.test(id)?'AL':/^ss/.test(id)?'SS':/^s|a2/.test(id)?'ST':/^ti/.test(id)?'TI':/brass|cu|brz/.test(id)?'CU':'?';
function learn(kind,opg,matId,D,tm){if(!SETS().useShop)return null;const fam=MATFAM(matId);let c=lessons().filter(s=>s.kind===kind&&(opg==null||s.op===opg)&&!s.lathe&&s.sfm>0&&s.ipt>0);
 c=c.map(s=>{const k=matKey(s.material);return{s,sc:k.id===matId?3:k.fam===fam?1:0};}).filter(x=>x.sc>0);if(!c.length)return null;const chartC=c.filter(x=>x.s.src==='chart');if(chartC.length){const bc=Math.max(...chartC.map(x=>x.sc));c=chartC.filter(x=>x.sc===bc).map(x=>x.s);}else{const best=Math.max(...c.map(x=>x.sc));c=c.filter(x=>x.sc===best).map(x=>x.s);}
 if(tm){const t2=c.filter(s=>!s.tm||s.tm===tm);if(t2.length)c=t2;}
 const ch=c.filter(s=>s.src==='chart'&&s.dia>0).sort((a,b)=>a.dia-b.dia);let r=null;
 if(ch.length){let a=ch[0],b=ch[ch.length-1];for(let i=0;i<ch.length-1;i++)if(D>=ch[i].dia&&D<=ch[i+1].dia){a=ch[i];b=ch[i+1];break;}
   const t_=b.dia>a.dia?Math.min(1,Math.max(0,(D-a.dia)/(b.dia-a.dia))):0;const L=(p,q)=>p==null||q==null?(p??q):p+(q-p)*t_;
   r={sfm:L(a.sfm,b.sfm),ipt:L(a.ipt,b.ipt),docR:L(a.doc,b.doc),wocR:L(a.woc,b.woc),n:ch.length,src:'chart'};
   if(D<ch[0].dia||D>ch[ch.length-1].dia){const e=D<ch[0].dia?ch[0]:ch[ch.length-1];r.ipt=e.ipt*(kind==='tap'?1:Math.min(2,Math.max(0.5,D/e.dia)));}}
 else{const pr=c.filter(s=>s.dia>0&&D/s.dia>0.5&&D/s.dia<2&&!(kind!=='tap'&&s.sfm<30));if(!pr.length)return null;const wm=key=>{const a=pr.map(s=>({v:s[key],w:1/(1+Math.abs(Math.log(D/s.dia))*4)})).filter(x=>x.v!=null).sort((p,q)=>p.v-q.v);if(!a.length)return null;const W=a.reduce((p,x)=>p+x.w,0);let acc=0;for(const x of a){acc+=x.w;if(acc>=W/2)return x.v;}return a[a.length-1].v;};
   r={sfm:wm('sfm'),ipt:wm('ipt'),docR:null,wocR:wm('woc'),n:pr.length,src:'program'};}
 return r;}
function learnLathe(kind,opg){if(!SETS().useShop)return null;const fam=MATFAM(S.mat);const c=lessons().filter(s=>s.lathe&&s.kind===kind&&s.op===opg&&matKey(s.material).fam===fam&&s.sfm>0);if(c.length<2)return null;
 const med=k=>{const a=c.map(s=>s[k]).filter(v=>v!=null).sort((p,q)=>p-q);return a.length?a[Math.floor(a.length/2)]:null;};return{sfm:med('sfm'),ipr:med('ipt'),doc:med('doc'),n:c.length};}
const LKIND={face:['face','face'],adaptive:['mill','adaptive'],pocket:['mill','rough'],slot:['mill','rough'],rest:['mill','rough'],circ:['mill','adaptive'],spot:['spot','drill'],drill:['drill','drill'],tap:['tap','drill'],ream:['ream','drill'],surfFinish:['ball','finish'],surfWater:['ball','finish'],surfRadial:['ball','finish'],surfScallop:['ball','finish'],surfMorph:['ball','finish'],flow5:['ball','finish'],moulding:['ball','finish'],surfRough:['mill','rough']};
function applyShop(o,tl){let m=LKIND[o.type];if(o.type==='contour'&&(o.leave||0)>0)m=['mill','rough'];if(!m)return;if(m[1]==='adaptive'&&!learn(m[0],'adaptive',S.mat,tl.dia,tl.mat))m=['mill','rough'];
 const L=learn(m[0],m[1],S.mat,tl.dia,tl.mat==='hss'?'hss':'carbide');if(!L)return;const mc=mach();const rpm=Math.max(mc.rpmMin||40,Math.min(mc.rpmMax,Math.round(L.sfm*3.82/Math.max(tl.dia,0.01)/10)*10));
 const Z=['drill','spot'].includes(o.type)?2:Math.max(1,tl.flutes||2);let feed=o.type==='tap'?rpm*(tl.pitch||L.ipt):rpm*L.ipt*Z;feed=Math.min(feed,mc.fmax);o.rpm=rpm;o.feed=Math.round(feed*10)/10;o.plunge=Math.round(o.feed*0.35*10)/10;
 if(!o.docFix&&['face','adaptive','pocket','slot','surfRough'].includes(o.type)){if(L.docR)o.doc=+Math.min(L.docR*tl.dia,(tl.loc||1)*0.9,Math.abs(o.zTop-o.zBot)||9).toFixed(4);if(L.wocR)o.woc=+Math.min(L.wocR*tl.dia,tl.dia*0.95).toFixed(4);}
 o.note=(LANG==='vi'?'Dữ liệu xưởng':'Shop data')+' ×'+L.n+' ('+(L.src==='chart'?(LANG==='vi'?'bảng feed':'feed chart'):(LANG==='vi'?'chương trình cũ':'past programs'))+') · '+Math.round(L.sfm)+' SFM · '+(+L.ipt).toFixed(4)+(o.type==='tap'?' ipr':' ipt');o.shop=true;}

/* ================= LEARNING ================= */
const SV=(w,h,b)=>`<svg viewBox="0 0 ${w} ${h}" style="width:100%;height:auto;max-height:230px;background:#fff;border-radius:12px" font-family="Barlow,system-ui,sans-serif" font-size="11" font-weight="600">${b}</svg>`;
const LBL=(x,y,t,c)=>`<text x="${x}" y="${y}" fill="${c||'#14181c'}">${t}</text>`;
const LEARN=[
 {id:'tools',col:'#ff6a13',en:['Cutting tools','How end mills, drills and inserts cut, and how to choose them.'],vi:['Dao cắt','Dao phay, mũi khoan, mảnh dao cắt thế nào và cách chọn.'],
  pic:()=>SV(320,150,`<rect x="40" y="20" width="26" height="60" fill="#c9ced3" stroke="#6b737a"/><rect x="40" y="80" width="26" height="50" fill="#e0b84e" stroke="#7a5b12"/><path d="M40 90l26-8M40 102l26-8M40 114l26-8M40 126l26-8" stroke="#7a5b12"/>${LBL(72,50,'Shank / Cán')}${LBL(72,105,'Flutes, LOC / Me, chiều dài cắt')}${LBL(40,145,'Ø D')}<path d="M40 135h26" stroke="#d93a3a"/><rect x="200" y="60" width="30" height="30" transform="rotate(45 215 75)" fill="#f2c14e" stroke="#7a5b12"/>${LBL(185,120,'Insert CNMG 80°')}`),
  pts:[['Flutes: 2–3 for aluminum (room for chips), 4–5+ for steel (strength, finish).','Số me: 2–3 me cho nhôm (thoát phoi), 4–5 me trở lên cho thép (cứng, bóng).'],
   ['Carbide runs 3–5× the surface speed of HSS but is brittle — avoid chatter and shock.','Carbide chạy tốc độ cắt gấp 3–5 lần HSS nhưng giòn — tránh rung và va đập.'],
   ['Keep stick-out short: deflection grows with the cube of length (L³).','Để dao nhô ngắn: độ võng tăng theo lập phương chiều dài (L³).'],
   ['Coatings: ZrN / uncoated for aluminum, TiAlN / AlTiN for steel and heat.','Lớp phủ: ZrN / không phủ cho nhôm, TiAlN / AlTiN cho thép và nhiệt cao.'],
   ['Corner radius (bull nose) makes the edge stronger and leaves a better floor than a sharp corner.','Dao bo góc (bull nose) bền mép hơn và đáy đẹp hơn dao góc nhọn.'],
   ['Drill point 118° general, 135° split point for steel and stainless; always spot first.','Mũi khoan 118° dùng chung, 135° xẻ mũi cho thép và inox; luôn khoan mồi trước.'],
   ['Lathe inserts: 80° (C) strong for roughing, 55° (D) / 35° (V) for profiling and undercuts.','Mảnh tiện: 80° (C) khoẻ cho phá thô, 55° (D) / 35° (V) cho biên dạng và hốc lõm.']],
  quiz:[[['Which end mill is usually best for aluminum?','Dao phay nào thường tốt nhất cho nhôm?'],[['5-flute TiAlN','5 me phủ TiAlN'],['3-flute uncoated / ZrN','3 me không phủ / ZrN'],['HSS 6-flute','HSS 6 me']],1,['Fewer flutes give room for big aluminum chips; ZrN does not stick to aluminum.','Ít me thì phoi nhôm to thoát được; ZrN không dính nhôm.']],
   [['Doubling the stick-out makes deflection about…','Tăng gấp đôi độ nhô thì độ võng tăng khoảng…'],[['2×','2 lần'],['4×','4 lần'],['8×','8 lần']],2,['Deflection ∝ L³, so 2³ = 8.','Độ võng ∝ L³, nên 2³ = 8.']]]},
 {id:'fix',col:'#1c9b5f',en:['Fixtures & workholding','Hold the part so it cannot move, flex or vibrate.'],vi:['Đồ gá & kẹp phôi','Kẹp chi tiết để không xê dịch, không cong, không rung.'],
  pic:()=>SV(320,150,`<rect x="20" y="120" width="280" height="18" fill="#7d848a"/><rect x="50" y="60" width="40" height="60" fill="#a8afb5"/><rect x="230" y="60" width="40" height="60" fill="#a8afb5"/><rect x="90" y="40" width="140" height="45" fill="#5b83ea"/><rect x="95" y="85" width="14" height="35" fill="#d7dbdf"/><rect x="211" y="85" width="14" height="35" fill="#d7dbdf"/><path d="M90 55h-8M230 55h8" stroke="#d93a3a" stroke-width="3"/>${LBL(100,35,'Part / Phôi')}${LBL(96,146,'Parallels / Căn đệm','#fff')}${LBL(10,55,'Grip ≥ .125')}`),
  pts:[['3-2-1 rule: 3 points locate the bottom, 2 the side, 1 the end — then clamp against them.','Nguyên tắc 3-2-1: 3 điểm định vị đáy, 2 điểm cạnh bên, 1 điểm đầu — rồi kẹp ép vào.'],
   ['Clamp over support, never over air; clamping force should push into a locator.','Kẹp đè lên chỗ có đỡ, không kẹp vào khoảng trống; lực kẹp phải ép về phía chốt định vị.'],
   ['Vise: indicate the fixed jaw, tap the part down on parallels, grip at least 1/8".','Ê-tô: rà hàm cố định, gõ phôi sát căn đệm, kẹp tối thiểu 1/8".'],
   ['Soft jaws: machine a pocket that matches the part for 2nd operations.','Hàm mềm: phay hốc theo đúng hình chi tiết cho nguyên công 2.'],
   ['Through-cuts: leave the part above the jaws by more than the deepest cut + safety.','Cắt xuyên: để phôi nhô trên hàm nhiều hơn độ sâu cắt lớn nhất + an toàn.'],
   ['Thin parts: vacuum, tabs or screws to a subplate; never let the part fly free at the last pass.','Chi tiết mỏng: bàn hút, chừa tab hoặc bắt vít xuống subplate; đừng để chi tiết văng ra ở lượt cuối.']],
  quiz:[[['The "1" in 3-2-1 locating controls…','Số "1" trong 3-2-1 khống chế…'],[['the bottom plane','mặt đáy'],['the side','cạnh bên'],['the end stop','đầu chặn']],2,['3 = bottom, 2 = side, 1 = end.','3 = đáy, 2 = cạnh, 1 = đầu.']],
   [['Minimum grip in a vise is usually…','Phần kẹp tối thiểu trong ê-tô thường là…'],[['.030"','.030"'],['.125"','.125"'],['1.000"','1.000"']],1,['About 1/8" to hold safely.','Khoảng 1/8" để kẹp an toàn.']]]},
 {id:'tabs',col:'#e39b00',en:['Holding tabs','Keep cut-out parts attached to the sheet until the end.'],vi:['Tab giữ','Giữ chi tiết dính vào tấm đến cuối cùng.'],
  pic:()=>tabSectionSVGstatic(),
  pts:[['Hand-break tabs: .030–.060 thick, .250 wide; only when the load stays in the plane of the tab.','Tab bẻ tay: dày .030–.060, rộng .250; chỉ khi lực nằm trong mặt phẳng tab.'],
   ['Spacing: about one tab every 5" of perimeter, at least 2 per part; long parts need more.','Khoảng cách: khoảng 5" chu vi một tab, ít nhất 2 tab mỗi chi tiết; chi tiết dài cần nhiều hơn.'],
   ['Put tabs on straight edges, away from corners, where you can file them easily.','Đặt tab trên cạnh thẳng, tránh góc, chỗ dễ giũa.'],
   ['The tool lifts over a zone = tab width + tool diameter.','Dao nhấc lên qua vùng = rộng tab + Ø dao.'],
   ['Safety factor: tab strength ÷ cutting force ≥ 2. Thin tabs cannot take thrust from later drilling.','Hệ số an toàn: sức bền tab ÷ lực cắt ≥ 2. Tab mỏng không chịu được lực đẩy khi khoan sau.'],
   ['Two-sided 3D parts: put tabs at the parting line (widest section), flip and machine the back, then break.','Chi tiết 3D hai mặt: đặt tab ở đường phân khuôn (chỗ rộng nhất), lật gia công mặt sau rồi mới bẻ.']],
  quiz:[[['Tabs should be placed…','Nên đặt tab…'],[['in sharp corners','ở góc nhọn'],['on straight edges','trên cạnh thẳng'],['only on arcs','chỉ trên cung tròn']],1,['Straight edges are strong and easy to clean up.','Cạnh thẳng chắc và dễ làm sạch.']]]},
 {id:'feeds',col:'#2457d6',en:['Speeds & feeds','RPM, feed, chip load, chip thinning and depth of cut.'],vi:['Tốc độ & bước tiến','RPM, bước tiến, lượng ăn/răng, chip thinning và chiều sâu cắt.'],
  pic:()=>SV(320,140,`<circle cx="90" cy="70" r="45" fill="#e9edf2" stroke="#6b737a"/><path d="M90 70L130 50" stroke="#2457d6" stroke-width="2"/><path d="M135 20h120v100H135z" fill="#c9ced3"/><path d="M135 20h30v100h-30" fill="#ffd6b8"/>${LBL(140,15,'WOC / ae')}${LBL(260,70,'DOC / ap')}${LBL(40,135,'RPM = SFM × 3.82 ÷ D')}${LBL(180,135,'IPM = RPM × Z × IPT')}`),
  pts:[['RPM = SFM × 3.82 ÷ D (inch). Example: 1/2" end mill at 400 SFM → 3056 RPM.','RPM = SFM × 3.82 ÷ D (inch). Ví dụ: dao 1/2" ở 400 SFM → 3056 RPM.'],
   ['Feed IPM = RPM × flutes × chip load (IPT). Drills use IPR × RPM; taps use pitch × RPM.','Bước tiến IPM = RPM × số me × lượng ăn/răng (IPT). Khoan dùng IPR × RPM; taro dùng bước ren × RPM.'],
   ['Chip thinning: when WOC < 50% D, raise the feed by D ÷ (2√(D·WOC − WOC²)).','Chip thinning: khi WOC < 50% D, tăng feed theo D ÷ (2√(D·WOC − WOC²)).'],
   ['Adaptive: light WOC (6–20% D), deep DOC (1–2× D), high feed — uses the whole flute.','Adaptive: WOC nhẹ (6–20% D), DOC sâu (1–2× D), feed cao — dùng hết chiều dài me.'],
   ['Too slow a feed rubs and work-hardens (stainless!); too fast chips and breaks the tool.','Feed quá chậm thì miết và làm cứng bề mặt (inox!); quá nhanh thì mẻ và gãy dao.'],
   ['Horsepower ≈ MRR × unit power; MRR = WOC × DOC × IPM.','Công suất ≈ MRR × hệ số vật liệu; MRR = WOC × DOC × IPM.'],
   ['Your shop chart runs about 3000 RPM — MINI CAM uses it first when the data matches.','Bảng feed của xưởng chạy khoảng 3000 RPM — MINI CAM ưu tiên dùng khi dữ liệu khớp.']],
  quiz:[[['3/8" end mill, 600 SFM. RPM ≈ ?','Dao 3/8", 600 SFM. RPM ≈ ?'],[['3,800','3.800'],['6,110','6.110'],['9,000','9.000']],1,['600 × 3.82 ÷ 0.375 ≈ 6112.','600 × 3,82 ÷ 0,375 ≈ 6112.']],
   [['1/4-20 tap at 400 RPM. Feed = ?','Taro 1/4-20 ở 400 RPM. Feed = ?'],[['8 IPM','8 IPM'],['20 IPM','20 IPM'],['40 IPM','40 IPM']],1,['Pitch = 1/20 = .05; 400 × .05 = 20 IPM.','Bước ren = 1/20 = .05; 400 × .05 = 20 IPM.']],
   [['WOC 10% of D. Chip load should be…','WOC bằng 10% D. Lượng ăn/răng nên…'],[['lower','giảm'],['the same','giữ nguyên'],['higher (chip thinning)','tăng (chip thinning)']],2,['Thin radial engagement makes thinner chips, so feed goes up.','Ăn ngang mỏng thì phoi mỏng, nên tăng feed.']]]},
 {id:'mat',col:'#6b737a',en:['Materials','How to machine each metal and plastic — tap a material below.'],vi:['Vật liệu','Cách gia công từng loại kim loại và nhựa — bấm vào vật liệu bên dưới.'],
  pic:()=>SV(320,120,C.MATERIALS.slice(0,12).map((m,i)=>`<rect x="${10+(i%6)*51}" y="${10+Math.floor(i/6)*52}" width="46" height="46" rx="8" fill="${m.color}" stroke="#6b737a"/><text x="${33+(i%6)*51}" y="${38+Math.floor(i/6)*52}" text-anchor="middle" font-size="9">${m.id.toUpperCase().slice(0,6)}</text>`).join('')),
  pts:[['Soft (aluminum, brass, plastic): high RPM, sharp 2–3 flute tools, big chips.','Mềm (nhôm, đồng thau, nhựa): RPM cao, dao 2–3 me sắc, phoi to.'],
   ['Steel: 4-flute TiAlN carbide, moderate speed, flood coolant.','Thép: carbide 4 me phủ TiAlN, tốc độ vừa, tưới nguội.'],
   ['Stainless: work-hardens — never rub or dwell; keep a steady chip load.','Inox: bị cứng khi cắt — không miết, không dừng dao; giữ lượng ăn đều.'],
   ['Titanium & Inconel: heat goes into the tool — slow SFM, light WOC, high-pressure coolant.','Titan & Inconel: nhiệt dồn vào dao — SFM thấp, WOC nhẹ, nước áp lực cao.'],
   ['Cast iron: dusty chips, cut dry with dust collection.','Gang: phoi bụi, cắt khô và hút bụi.']],
  quiz:[[['Which material work-hardens if the tool rubs?','Vật liệu nào bị cứng lên khi dao miết?'],[['6061 aluminum','Nhôm 6061'],['304 stainless','Inox 304'],['Brass','Đồng thau']],1,['Austenitic stainless hardens at the surface when rubbed.','Inox austenit bị cứng bề mặt khi bị miết.']],
   [['Best coolant for cast iron?','Làm mát tốt nhất cho gang?'],[['Dry + dust collection','Khô + hút bụi'],['Flood oil','Dầu tưới'],['Water mist only','Chỉ phun sương nước']],0,['Cast iron makes powder chips; it is usually cut dry.','Gang tạo phoi bột; thường cắt khô.']]]},
 {id:'hard',col:'#b42318',en:['Hardness','HRC, HRB, HB, HV — what they mean and how they change cutting.'],vi:['Độ cứng','HRC, HRB, HB, HV — ý nghĩa và ảnh hưởng tới cắt gọt.'],
  pic:()=>SV(320,140,`<rect x="20" y="90" width="280" height="35" fill="#a8afb5"/><path d="M80 20v50l-12 20h24l-12-20" fill="#2457d6"/><path d="M160 20v54" stroke="#14181c" stroke-width="6"/><path d="M152 74l8 14 8-14z" fill="#14181c"/><circle cx="240" cy="78" r="12" fill="#6b737a"/><path d="M240 20v46" stroke="#6b737a" stroke-width="6"/><path d="M68 90q12 8 24 0M152 90l8 6 8-6M228 90q12 9 24 0" stroke="#d93a3a" stroke-width="2" fill="none"/>`+LBL(55,135,'HV / Vickers')+LBL(140,135,'HRC (cone)')+LBL(215,135,'HB / HRB (ball)')),
  pts:[['Hardness tests press a point or ball into the metal and measure the dent: smaller dent = harder.','Đo độ cứng là ép mũi hoặc bi vào kim loại rồi đo vết lõm: vết càng nhỏ = càng cứng.'],
   ['HRB (ball) for soft metals: aluminum, brass, mild steel. HRC (diamond cone) for hardened steel 20–70.','HRB (bi) cho kim loại mềm: nhôm, đồng thau, thép mềm. HRC (mũi kim cương) cho thép tôi 20–70.'],
   ['HB (Brinell) is common on material certs; HV (Vickers) covers everything.','HB (Brinell) hay ghi trên chứng chỉ vật liệu; HV (Vickers) đo được mọi loại.'],
   ['Steel strength ≈ HB ÷ 2 in ksi (e.g. 300 HB ≈ 150 ksi).','Độ bền thép ≈ HB ÷ 2 tính bằng ksi (ví dụ 300 HB ≈ 150 ksi).'],
   ['Above ~28 HRC lower SFM 25–40%; above ~45 HRC use hard-milling tools; above ~55 HRC grind or EDM.','Trên ~28 HRC giảm SFM 25–40%; trên ~45 HRC dùng dao phay cứng; trên ~55 HRC thì mài hoặc cắt dây EDM.'],
   ['Use the Hardness converter in the Calculator tab.','Dùng máy quy đổi Độ cứng trong tab Máy tính.']],
  quiz:[[['30 HRC is about how many HB?','30 HRC khoảng bao nhiêu HB?'],[['150','150'],['286','286'],['500','500']],1,['30 HRC ≈ 286 HB (ASTM E140).','30 HRC ≈ 286 HB (ASTM E140).']],
   [['Which scale for hardened tool steel at 58?','Thang nào cho thép dụng cụ tôi ở mức 58?'],[['HRB','HRB'],['HRC','HRC'],['Shore A','Shore A']],1,['Hardened steel is measured in HRC.','Thép tôi đo bằng HRC.']]]},
 {id:'gdt',col:'#8b4fd6',en:['GD&T basics','Read feature control frames: form, orientation, location, runout.'],vi:['GD&T cơ bản','Đọc khung dung sai: hình dạng, hướng, vị trí, đảo.'],
  pic:()=>SV(320,120,`<g stroke="#14181c" fill="none"><rect x="20" y="30" width="280" height="36"/><path d="M60 30v36M150 30v36M190 30v36M230 30v36M270 30v36"/><circle cx="40" cy="48" r="10"/><path d="M40 34v28M26 48h28"/></g>${LBL(68,54,'Ø.010 Ⓜ')}${LBL(165,54,'A')}${LBL(205,54,'B')}${LBL(245,54,'C')}${LBL(20,95,'Position · tolerance zone Ø.010 at MMC · datums A, B, C')}${LBL(20,112,'Vị trí · vùng dung sai Ø.010 ở MMC · chuẩn A, B, C')}`),
  pts:[['Form (no datum): flatness ⏥, straightness ⏤, circularity ○, cylindricity ⌭.','Hình dạng (không cần chuẩn): độ phẳng ⏥, độ thẳng ⏤, độ tròn ○, độ trụ ⌭.'],
   ['Orientation: perpendicularity ⊥, parallelism ∥, angularity ∠ — always to a datum.','Hướng: độ vuông góc ⊥, độ song song ∥, độ nghiêng ∠ — luôn so với chuẩn.'],
   ['Location: position ⌖ (holes, slots), profile of a line ⌒ / surface ⌓ (any shape).','Vị trí: vị trí ⌖ (lỗ, rãnh), biên dạng đường ⌒ / mặt ⌓ (mọi hình).'],
   ['Runout ↗ / total runout ⌰ on turned parts, measured while rotating on the datum axis.','Độ đảo ↗ / đảo toàn phần ⌰ cho chi tiết tiện, đo khi quay quanh trục chuẩn.'],
   ['Datums A-B-C follow the 3-2-1 rule: primary (3 points), secondary (2), tertiary (1). Set up the part the same way.','Chuẩn A-B-C theo 3-2-1: chuẩn chính (3 điểm), phụ (2), thứ ba (1). Gá chi tiết đúng như vậy.'],
   ['Ⓜ MMC bonus: a hole Ø.250 +.005/-0 with position Ø.010 Ⓜ — at Ø.255 the allowed position grows to Ø.015.','Ⓜ thưởng MMC: lỗ Ø.250 +.005/-0, vị trí Ø.010 Ⓜ — khi lỗ Ø.255 thì dung sai vị trí tăng lên Ø.015.'],
   ['Position zone is a circle: X/Y error e → actual position = 2√(ΔX² + ΔY²).','Vùng vị trí là hình tròn: sai X/Y → vị trí thực = 2√(ΔX² + ΔY²).']],
  quiz:[[['Which control needs no datum?','Ký hiệu nào không cần chuẩn?'],[['Perpendicularity','Độ vuông góc'],['Flatness','Độ phẳng'],['Position','Vị trí']],1,['Form controls (flatness, straightness…) stand alone.','Dung sai hình dạng (phẳng, thẳng…) không cần chuẩn.']],
   [['Hole off by X .003, Y .004. Position = ?','Lỗ lệch X .003, Y .004. Vị trí = ?'],[['Ø.005','Ø.005'],['Ø.007','Ø.007'],['Ø.010','Ø.010']],2,['2 × √(.003² + .004²) = 2 × .005 = Ø.010.','2 × √(.003² + .004²) = 2 × .005 = Ø.010.']]]},
 {id:'s25',col:'#0a9bb0',en:['2.5D strategies','Face, adaptive, pocket, contour, rest, drilling, chamfer, V-carve.'],vi:['Chiến lược 2.5D','Phay mặt, adaptive, hốc, contour, rest, khoan, vát, khắc V.'],
  pic:()=>SV(320,130,`<rect x="20" y="20" width="120" height="90" rx="10" fill="none" stroke="#14181c"/>${[0,1,2,3].map(k=>`<rect x="${30+k*10}" y="${30+k*10}" width="${100-k*20}" height="${70-k*20}" rx="${8-k*2}" fill="none" stroke="#2457d6"/>`).join('')}<rect x="180" y="20" width="120" height="90" rx="10" fill="none" stroke="#14181c"/><path d="M190 32h100M290 32v6H190v6h100v6H190v6h100v6H190v6h100v6H190v6h100v6H190v6h100" fill="none" stroke="#ff6a13"/>${LBL(30,125,'Offset / Theo biên')}${LBL(200,125,'Zigzag')}`),
  pts:[['Facing: make the top flat first — it is your Z0 reference.','Phay mặt: làm phẳng mặt trên trước — đó là chuẩn Z0.'],
   ['Adaptive / HSM: constant light step-over, full depth; cooler tool, faster, longer life.','Adaptive / HSM: bước ngang nhẹ đều, ăn hết chiều sâu; dao mát hơn, nhanh hơn, bền hơn.'],
   ['Pocket: offset passes follow the walls; zigzag is simpler for open, rectangular areas.','Phay hốc: chạy theo biên bám vách; zigzag đơn giản cho vùng rộng, hình chữ nhật.'],
   ['Contour: rough with step-downs leaving .010, then finish full depth in one pass for a straight wall.','Contour: phá thô từng lớp chừa .010, rồi tinh hết chiều sâu một lần để vách thẳng.'],
   ['Climb milling (tool on the left of the material, G41) gives better finish on CNC machines.','Phay thuận (dao ở bên trái vật liệu, G41) cho bề mặt đẹp hơn trên máy CNC.'],
   ['Rest machining: a smaller tool cleans only where the big tool could not reach.','Phay phần sót: dao nhỏ chỉ phay chỗ dao lớn không vào được.'],
   ['Holes: spot → drill (peck if deeper than 3× D) → ream / tap / bore. Chamfer last.','Lỗ: khoan mồi → khoan (mổ nếu sâu hơn 3× D) → doa / taro / móc. Vát mép sau cùng.'],
   ['Entry: helical or ramp into pockets; plunge only with center-cutting tools or a pre-drilled hole.','Vào dao: xoắn ốc hoặc xuống dốc vào hốc; chỉ cắm thẳng với dao cắt tâm hoặc có lỗ khoan sẵn.']],
  quiz:[[['Why finish the wall in one full-depth pass?','Tại sao tinh vách một lần hết chiều sâu?'],[['It is faster to program','Lập trình nhanh hơn'],['No step marks, straighter wall','Không vết bậc, vách thẳng hơn'],['Uses less coolant','Ít nước làm mát']],1,['Several depths leave witness lines where deflection changes.','Nhiều lớp để lại vết bậc do dao võng khác nhau.']]]},
 {id:'s3d',col:'#e0457b',en:['3D strategies','Roughing and finishing curved surfaces.'],vi:['Chiến lược 3D','Phá thô và phay tinh bề mặt cong.'],
  pic:()=>SV(320,130,`<path d="M20 110 C80 20 240 20 300 110" fill="#e9edf2" stroke="#14181c"/>${[0,1,2,3,4,5,6,7].map(k=>`<circle cx="${40+k*35}" cy="${110-Math.sin((k*35+20)/280*Math.PI)*68}" r="12" fill="none" stroke="#e0457b"/>`).join('')}${LBL(20,125,'Ball end mill · stepover → scallop height / Dao cầu · bước ngang → chiều cao gợn')}`),
  pts:[['Rough with Z-level layers and a flat or bull-nose tool, leave .010–.020 stock.','Phá thô theo lớp Z bằng dao phẳng hoặc bo góc, chừa .010–.020.'],
   ['Finish with a ball mill: parallel for shallow areas, waterline for steep walls, scallop / morph for constant finish.','Tinh bằng dao cầu: song song cho vùng thoải, đường đồng mức cho vách dốc, scallop / morph cho bề mặt đều.'],
   ['Scallop height h ≈ stepover² ÷ (8 × R). Half the stepover → a quarter of the cusp.','Chiều cao gợn h ≈ bước ngang² ÷ (8 × R). Giảm nửa bước ngang → gợn còn 1/4.'],
   ['The center of a ball mill has zero surface speed — tilt (5-axis) or avoid flat floors with a ball.','Tâm dao cầu có tốc độ cắt bằng 0 — nghiêng dao (5 trục) hoặc tránh đáy phẳng với dao cầu.'],
   ['Rest-finish corners with a smaller ball; use effective diameter for RPM on shallow cuts.','Phay góc còn sót bằng dao cầu nhỏ hơn; tính RPM theo đường kính hiệu dụng khi ăn nông.']],
  quiz:[[['1/4" ball (R .125), stepover .010. Cusp ≈ ?','Dao cầu 1/4" (R .125), bước ngang .010. Gợn ≈ ?'],[['.0001"','.0001"'],['.001"','.001"'],['.010"','.010"']],0,['.010² ÷ (8 × .125) = .0001".','.010² ÷ (8 × .125) = .0001".']]]},
 {id:'s4',col:'#c48a00',en:['4th-axis strategies','Indexing, wrapping and rotary machining.'],vi:['Chiến lược trục 4','Xoay chia độ, quấn hình và phay tròn xoay.'],
  pic:()=>SV(320,130,`<ellipse cx="60" cy="65" rx="18" ry="45" fill="#c9ced3" stroke="#6b737a"/><rect x="60" y="20" width="200" height="90" fill="#dfe4e9" stroke="#6b737a"/><ellipse cx="260" cy="65" rx="18" ry="45" fill="#c9ced3" stroke="#6b737a"/><path d="M80 50 C120 30 160 90 200 60 S240 40 250 55" fill="none" stroke="#c48a00" stroke-width="3"/><path d="M30 65h260" stroke="#888" stroke-dasharray="6 3"/>${LBL(120,125,'A rotates around X / A xoay quanh X')}`),
  pts:[['3+1 indexing: rotate A, lock the brake, machine each face like 3-axis — rigid and simple.','3+1 chia độ: xoay A, khoá phanh, gia công từng mặt như 3 trục — cứng và đơn giản.'],
   ['Wrapping: flat Y becomes A = Y ÷ (π × D) × 360°. Keep the tool on the centerline.','Quấn hình: Y phẳng thành A = Y ÷ (π × D) × 360°. Giữ dao trên đường tâm.'],
   ['Z0 at the rotary centerline makes Z equal to the radius you are cutting.','Z0 ở tâm trục xoay thì Z bằng bán kính đang cắt.'],
   ['Use inverse-time feed (G93) for moves that combine A with X/Z so the surface speed stays right.','Dùng feed theo thời gian (G93) khi A chạy cùng X/Z để tốc độ trên bề mặt đúng.'],
   ['Support long parts with a tailstock; check rotary torque and max speed (e.g. HRT160SS 500°/s).','Đỡ chi tiết dài bằng ụ động; kiểm tra mô-men và tốc độ bàn xoay (ví dụ HRT160SS 500°/giây).']],
  quiz:[[['Wrap Y = 1.571" on Ø2.000. A = ?','Quấn Y = 1.571" trên Ø2.000. A = ?'],[['45°','45°'],['90°','90°'],['180°','180°']],1,['1.571 ÷ (π × 2) × 360 = 90°.','1.571 ÷ (π × 2) × 360 = 90°.']]]},
 {id:'s5',col:'#5c6bc0',en:['5-axis strategies','3+2, swarf, flow, deburr and tool tilt.'],vi:['Chiến lược 5 trục','3+2, swarf, flow, vát cạnh và nghiêng dao.'],
  pic:()=>SV(320,140,`<path d="M20 120 C100 60 220 60 300 120" fill="#e9edf2" stroke="#14181c"/><g transform="rotate(20 160 72)"><rect x="152" y="10" width="16" height="55" fill="#c9ced3" stroke="#6b737a"/><circle cx="160" cy="68" r="8" fill="#f2c14e" stroke="#7a5b12"/></g><path d="M160 72L160 20" stroke="#888" stroke-dasharray="4 3"/>${LBL(185,30,'Lead / lean angle')}${LBL(20,135,'Tilt the ball off its dead center / Nghiêng để tránh tâm dao cầu')}`),
  pts:[['3+2: tilt B/C, then lock and machine like 3-axis — most 5-axis work in job shops.','3+2: nghiêng B/C rồi khoá, gia công như 3 trục — phần lớn việc 5 trục ở xưởng.'],
   ['Use DWO / CYCLE800 (work plane) so the control handles the rotated coordinates.','Dùng DWO / CYCLE800 (mặt phẳng làm việc) để máy tự xử lý toạ độ xoay.'],
   ['Simultaneous needs TCPC (Haas G234, Siemens TRAORI): you program the tool tip, the control moves the axes.','Đồng thời cần TCPC (Haas G234, Siemens TRAORI): lập trình mũi dao, máy tự chạy các trục.'],
   ['Lead / lag tilts along the cut, lean tilts sideways — 5–15° keeps the ball off its zero-speed center.','Lead / lag nghiêng theo hướng cắt, lean nghiêng ngang — 5–15° giúp tránh tâm dao cầu.'],
   ['Swarf cuts ruled walls with the flank; flow follows surface curves; deburr traces edges at 45°.','Swarf cắt vách thẳng bằng cạnh dao; flow bám đường cong bề mặt; deburr đi theo cạnh ở 45°.'],
   ['Always check tilt limits (UMC-750 B −35/+110°), holder clearance and simulate before running.','Luôn kiểm tra giới hạn nghiêng (UMC-750 B −35/+110°), khoảng hở đầu kẹp và mô phỏng trước khi chạy.']],
  quiz:[[['Why tilt a ball mill 10° on a flat-ish surface?','Tại sao nghiêng dao cầu 10° trên bề mặt gần phẳng?'],[['To avoid the zero-speed center','Tránh tâm có tốc độ cắt bằng 0'],['To cut deeper','Cắt sâu hơn'],['To save tool changes','Bớt thay dao']],0,['The ball center does not cut well; a small tilt uses faster cutting edge.','Tâm dao cầu cắt kém; nghiêng nhẹ dùng phần lưỡi có tốc độ cao hơn.']]]},
];
const MINFO={"al6061": ["95 HB", "Brackets, plates, fixtures, general parts — the most common shop aluminum.", "Bát, tấm, đồ gá, chi tiết thông dụng — nhôm phổ biến nhất ở xưởng.", "Run fast. Sharp 2–3 flute carbide, high RPM, big chips. Watch for chips welding to the tool (built-up edge).", "Chạy nhanh. Dao carbide 2–3 me sắc, RPM cao, phoi to. Coi chừng phoi dính lưỡi dao.", "Flood coolant or mist; air blast to clear chips from pockets.", "Tưới nguội hoặc phun sương; thổi khí cho sạch phoi trong hốc."], "al7075": ["150 HB", "Aerospace, high-strength parts, molds.", "Hàng không, chi tiết chịu lực cao, khuôn.", "Machines even better than 6061 (harder, chips break nicely). Can warp after heavy roughing — rough, release clamps, then finish.", "Gia công còn đẹp hơn 6061 (cứng hơn, phoi gãy gọn). Dễ cong sau khi phá thô nặng — phá thô, nới kẹp, rồi mới tinh.", "Flood or mist.", "Tưới nguội hoặc phun sương."], "al2024": ["120 HB", "Aircraft parts, fittings that need fatigue strength.", "Chi tiết máy bay, khớp nối cần bền mỏi.", "Similar to 7075. Gummy when annealed; T3 machines well. Deburr well — sharp edges crack.", "Giống 7075. Ở trạng thái ủ thì dẻo; T3 gia công tốt. Làm sạch bavia kỹ — cạnh sắc dễ nứt.", "Flood.", "Tưới nguội."], "al5052": ["60 HB", "Sheet metal, boxes, marine parts.", "Tôn tấm, hộp, chi tiết tàu biển.", "Soft and gummy: very sharp polished tools, higher feed so the tool cuts instead of rubs. Hold thin sheet with vacuum or tabs.", "Mềm và dẻo: dao thật sắc, bóng me, feed cao hơn để cắt chứ không miết. Tấm mỏng thì dùng bàn hút hoặc tab.", "Mist or lots of coolant to stop sticking.", "Phun sương hoặc nhiều nước để không dính."], "mic6": ["65 HB", "Flat tooling plates, fixture bases, inspection plates.", "Tấm đế đồ gá, tấm phẳng, tấm kiểm tra.", "Cast and stress-relieved: stays flat after cutting. Already ground flat — often no facing needed.", "Đúc và khử ứng suất: cắt xong vẫn phẳng. Đã mài phẳng sẵn — thường không cần phay mặt.", "Flood or mist.", "Tưới nguội hoặc phun sương."], "brass": ["80–100 HB", "Fittings, valves, electrical parts, decorative parts.", "Đầu nối, van, chi tiết điện, đồ trang trí.", "Easiest metal to machine. Use 0° rake (or dull the edge) for drilling — sharp drills grab and pull in.", "Kim loại dễ gia công nhất. Khoan dùng góc thoát 0° (hoặc mài cùn mép) — mũi khoan sắc dễ bị kéo tụt vào.", "Dry or light coolant.", "Khô hoặc ít nước."], "cu110": ["40–90 HB", "Bus bars, electrodes, heat sinks.", "Thanh cái điện, điện cực, tản nhiệt.", "Very gummy. Sharp polished tools, high rake, avoid rubbing. Burrs are big — plan a chamfer pass.", "Rất dẻo. Dao sắc bóng, góc thoát lớn, tránh miết. Bavia lớn — nên có lượt vát mép.", "Flood coolant.", "Tưới nguội nhiều."], "brz932": ["65 HB", "Bushings, bearings, wear plates.", "Bạc lót, ổ trượt, tấm chống mòn.", "Cuts like brass but a bit tougher. Good finish with sharp carbide; reaming gives great bores.", "Cắt giống đồng thau nhưng dai hơn chút. Carbide sắc cho bề mặt đẹp; doa ra lỗ rất đẹp.", "Dry or flood.", "Khô hoặc tưới nguội."], "delrin": ["Shore D 85", "Gears, bushings, insulators, food-safe parts.", "Bánh răng, bạc lót, cách điện, chi tiết thực phẩm.", "Melts if chips are re-cut: single/2-flute O-flute tools, high feed, clear chips with air. Hold lightly — it springs.", "Bị chảy nếu cắt lại phoi: dao 1–2 me O-flute, feed cao, thổi khí sạch phoi. Kẹp nhẹ — nhựa bị đàn hồi.", "Air blast (coolant ok).", "Thổi khí (nước cũng được)."], "s1018": ["126 HB", "Shafts, brackets, weld plates, general steel parts.", "Trục, bát, tấm hàn, chi tiết thép thông dụng.", "Gummy — finish can tear. Carbide TiAlN 4-flute, keep the feed up. Good for welding after machining.", "Hơi dẻo — bề mặt có thể bị xé. Carbide 4 me phủ TiAlN, giữ feed cao. Hàn tốt sau khi gia công.", "Flood coolant.", "Tưới nguội."], "s12l14": ["160 HB", "High-volume screw-machine parts, fittings.", "Chi tiết tiện số lượng lớn, đầu nối.", "Free machining (leaded): chips break, great finish, fast feeds. Not for welding or heat treating.", "Thép dễ cắt (có chì): phoi gãy, bóng đẹp, feed nhanh. Không hàn, không nhiệt luyện.", "Flood.", "Tưới nguội."], "s1045": ["170–210 HB", "Shafts, gears, axles that need more strength than 1018.", "Trục, bánh răng, láp cần bền hơn 1018.", "Harder than 1018, cuts cleaner. Lower SFM ~15%. Can be induction hardened after.", "Cứng hơn 1018, cắt sạch hơn. Giảm SFM khoảng 15%. Có thể tôi cao tần sau.", "Flood.", "Tưới nguội."], "s4140": ["28–32 HRC", "Tooling, shafts, molds, high-strength parts.", "Dụng cụ, trục, khuôn, chi tiết chịu lực.", "Pre-hardened: AlTiN carbide, lower SFM, rigid setup, short tools. Peck deep holes; taps need good lube.", "Đã tôi trước: carbide AlTiN, giảm SFM, gá thật cứng, dao ngắn. Lỗ sâu khoan mổ; taro cần dầu tốt.", "Flood coolant; tapping oil.", "Tưới nguội; dầu taro."], "s4340": ["200–230 HB", "Landing gear, heavy-duty shafts, gears.", "Càng đáp, trục chịu tải nặng, bánh răng.", "Tough. Similar to 4140 annealed. Keep chip load steady — rubbing work-hardens it.", "Dai. Giống 4140 ủ. Giữ lượng ăn/răng đều — miết sẽ làm cứng bề mặt.", "Flood.", "Tưới nguội."], "a2": ["200–230 HB", "Punches, dies, gauges (hardened after machining).", "Chày, cối, dưỡng đo (tôi cứng sau gia công).", "Machine annealed, leave .005–.010 per side for grinding after heat treat. Avoid sharp inside corners (crack risk).", "Gia công lúc ủ, chừa .005–.010 mỗi bên để mài sau nhiệt luyện. Tránh góc trong sắc (dễ nứt).", "Flood.", "Tưới nguội."], "ss303": ["160–200 HB", "Fittings, shafts, screws — stainless that machines easily.", "Đầu nối, trục, vít — inox dễ gia công.", "Free-machining stainless (sulfur). Easier than 304 but still keep feeds up. Not for welding.", "Inox dễ cắt (có lưu huỳnh). Dễ hơn 304 nhưng vẫn giữ feed cao. Không dùng để hàn.", "Flood coolant.", "Tưới nguội."], "ss304": ["150–200 HB", "Food equipment, enclosures, brackets.", "Thiết bị thực phẩm, vỏ hộp, bát.", "Work-hardens: NEVER dwell or rub. Sharp AlTiN carbide, constant chip load, no light finishing passes (<.002).", "Bị cứng khi cắt: KHÔNG dừng dao hay miết. Carbide AlTiN sắc, lượng ăn đều, không chạy tinh quá mỏng (<.002).", "Lots of flood coolant.", "Tưới nguội nhiều."], "ss316": ["150–200 HB", "Marine, medical, chemical parts.", "Chi tiết tàu biển, y tế, hoá chất.", "Gummier than 304 — same rules, a little slower. Sharp tools, keep cutting.", "Dẻo hơn 304 — cùng quy tắc, chậm hơn chút. Dao sắc, luôn giữ dao đang cắt.", "Lots of flood coolant.", "Tưới nguội nhiều."], "ss174": ["28–35 HRC", "Aerospace, valves, pump shafts.", "Hàng không, van, trục bơm.", "Strong and hard. AlTiN carbide, rigid setup, slower SFM. Condition H1150 is the easiest to machine.", "Bền và cứng. Carbide AlTiN, gá cứng, SFM thấp. Trạng thái H1150 dễ gia công nhất.", "High-pressure coolant if possible.", "Nước áp lực cao nếu có."], "ci": ["180–220 HB", "Machine bases, housings, brake parts.", "Thân máy, vỏ hộp, chi tiết phanh.", "Chips are dust: cut dry with vacuum or air. Edges chip out — chamfer before breaking through.", "Phoi là bụi: cắt khô, hút bụi hoặc thổi khí. Cạnh dễ mẻ — vát mép trước khi cắt xuyên.", "Dry + dust collection.", "Cắt khô + hút bụi."], "ti64": ["36 HRC", "Aerospace, medical implants, racing parts.", "Hàng không, cấy ghép y tế, chi tiết đua.", "Heat goes into the tool: low SFM, high chip load, light WOC adaptive. Never let the tool rub. Chips can catch fire — no dry cutting.", "Nhiệt dồn vào dao: SFM thấp, lượng ăn lớn, adaptive WOC nhẹ. Đừng để dao miết. Phoi có thể cháy — không cắt khô.", "High-pressure flood coolant.", "Tưới nguội áp lực cao."], "in718": ["36–44 HRC", "Jet engines, turbines, high-heat parts.", "Động cơ phản lực, tuabin, chi tiết chịu nhiệt.", "Hardest common alloy here: very low SFM, ceramic or special carbide, new sharp tools, rigid machine. Expect short tool life.", "Hợp kim khó nhất trong danh sách: SFM rất thấp, dao ceramic hoặc carbide chuyên dụng, dao mới sắc, máy cứng. Tuổi thọ dao ngắn.", "High-pressure coolant.", "Nước áp lực cao."]};
const LEASY={"mat": ["Each metal has a personality: aluminum is fast and easy, stainless gets hard if you rub it, titanium gets hot. Match speed, tool and coolant to it.", "Mỗi kim loại có tính riêng: nhôm nhanh và dễ, inox bị cứng nếu miết, titan rất nóng. Chọn tốc độ, dao và nước làm mát cho đúng.", "Example: same 1/2\" tool → 6061 at ~7600 RPM, 304 stainless at ~2300 RPM.", "Ví dụ: cùng dao 1/2\" → nhôm 6061 khoảng 7600 RPM, inox 304 khoảng 2300 RPM."], "hard": ["Hardness = how hard it is to dent the metal. Harder metal = slower speed, stronger tool, shorter tool life.", "Độ cứng = kim loại khó bị lõm cỡ nào. Càng cứng = càng chậm, dao càng phải khoẻ, dao càng mau mòn.", "Example: 4140 at 30 HRC ≈ 286 HB ≈ 143 ksi. At 50 HRC you need hard-milling tools.", "Ví dụ: 4140 ở 30 HRC ≈ 286 HB ≈ 143 ksi. Ở 50 HRC phải dùng dao phay cứng."],"tools": ["Think of an end mill like a saw that spins: big gaps (few flutes) let big chips out, many teeth give a smoother cut in hard metal.", "Dao phay giống cái cưa quay tròn: ít răng (ít me) thì phoi to thoát dễ, nhiều răng thì cắt êm hơn trên kim loại cứng.", "Example: 6061 aluminum → 1/2\" 3-flute carbide. 4140 steel → 1/2\" 5-flute TiAlN.", "Ví dụ: nhôm 6061 → dao carbide 1/2\" 3 me. Thép 4140 → dao 1/2\" 5 me phủ TiAlN."], "fix": ["Hold the part like you hold a phone to take a photo: firm, flat, and it must not wiggle.", "Kẹp phôi giống cầm điện thoại chụp hình: chắc tay, nằm phẳng, không được rung.", "Example: part 1\" thick → stock 1.43\" → .300 in the jaws, part top sits above the jaws.", "Ví dụ: chi tiết dày 1\" → phôi 1.43\" → kẹp .300 trong hàm, mặt trên chi tiết nằm trên hàm."], "tabs": ["Tabs are like the little plastic bits that hold model-kit pieces to the frame: the part stays put, then you snap it off.", "Tab giống mấy cái chân nhựa giữ mảnh lắp ráp mô hình vào khung: chi tiết đứng yên, xong rồi bẻ ra.", "Example: 10\" perimeter → 2–3 tabs, .250 wide, .040 thick.", "Ví dụ: chu vi 10\" → 2–3 tab, rộng .250, dày .040."], "feeds": ["RPM is how fast the tool spins, feed is how fast it walks. Too slow = rubbing and heat, too fast = broken tool.", "RPM là dao quay nhanh cỡ nào, feed là dao đi nhanh cỡ nào. Chậm quá = miết, nóng; nhanh quá = gãy dao.", "Example: 1/2\" 3-flute in aluminum, 800 SFM → 6112 RPM × 3 × .004 = 73 IPM.", "Ví dụ: dao 1/2\" 3 me, nhôm, 800 SFM → 6112 RPM × 3 × .004 = 73 IPM."], "gdt": ["Plus/minus tells you the size; GD&T tells you the shape and where it sits — like saying a door must be flat, square to the floor, and in the right place.", "Dung sai ± cho biết kích thước; GD&T cho biết hình dạng và vị trí — như cánh cửa phải phẳng, vuông với sàn và đúng chỗ.", "Example: ⌖ Ø.010 A B C → the hole center must be inside a .010 circle measured from datums A, B, C.", "Ví dụ: ⌖ Ø.010 A B C → tâm lỗ phải nằm trong vòng tròn Ø.010 đo từ chuẩn A, B, C."], "s25": ["2.5D = cut flat layers, like cutting a cake one layer at a time: the tool moves in X/Y, then steps down in Z.", "2.5D = cắt từng lớp phẳng, như cắt bánh từng tầng: dao chạy X/Y rồi hạ xuống Z.", "Example: 1\" deep contour, .250 per pass → 4 rough passes leaving .010, then 1 finish pass full depth.", "Ví dụ: contour sâu 1\", mỗi lớp .250 → 4 lượt thô chừa .010, rồi 1 lượt tinh hết chiều sâu."], "s3d": ["3D = the tool moves X, Y and Z together to follow a curve, like a car driving over hills.", "3D = dao chạy X, Y, Z cùng lúc theo bề mặt cong, như xe chạy qua đồi.", "Example: rough with 1/2\" bull nose leaving .015, finish with 1/4\" ball, stepover .010.", "Ví dụ: phá thô bằng dao 1/2\" bo góc chừa .015, tinh bằng dao cầu 1/4\", bước ngang .010."], "s4": ["The 4th axis spins the part like a rotisserie chicken so the tool can reach all around.", "Trục 4 xoay chi tiết như quay gà nướng để dao với tới mọi phía.", "Example: hex on a shaft → index A0, A60, A120… and mill a flat at each angle.", "Ví dụ: phay lục giác trên trục → xoay A0, A60, A120… rồi phay mặt phẳng ở mỗi góc."], "s5": ["5-axis tilts the tool (or table) like tilting your head to see around a corner — reach more sides in one setup.", "5 trục nghiêng dao (hoặc bàn) như nghiêng đầu nhìn quanh góc — với tới nhiều mặt trong một lần gá.", "Example: hole on a 30° face → 3+2: tilt B30, lock, drill like normal.", "Ví dụ: lỗ trên mặt nghiêng 30° → 3+2: nghiêng B30, khoá, khoan như bình thường."]};
function tabSectionSVGstatic(){return SV(320,120,`<rect x="10" y="30" width="300" height="50" fill="#eef1f4" stroke="#9aa3ab" stroke-dasharray="4 3"/><rect x="130" y="68" width="60" height="12" fill="#ff6a13"/><path d="M10 82H105L110 68H210L215 82H310" fill="none" stroke="#2457d6" stroke-width="2.4" stroke-dasharray="7 4"/>${LBL(118,62,'TAB .250 × .030','#b54200')}${LBL(10,105,'Tool lifts over tab + tool Ø / Dao nhấc qua tab + Ø dao','#2457d6')}`);}
function matGrid(top){const vi=LANG==='vi',sel=S._mi;const m=sel&&C.MATERIALS.find(x=>x.id===sel),inf=m&&MINFO[m.id];
 const rpm=(m)=>Math.round(m.sfmC*3.82/0.5);
 const grid=`<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:8px">${C.MATERIALS.map(x=>`<button class="btn" data-mi="${x.id}" style="justify-content:flex-start;gap:8px;text-align:left;min-height:52px;white-space:normal;${x.id===sel?'outline:3px solid #2457d6':''}"><i style="flex:none;width:20px;height:20px;border-radius:5px;background:${x.color};border:1px solid #0003"></i><span style="font-size:13px;line-height:1.2">${esc(vi?x.vi:x.en)}</span></button>`).join('')}</div>`;
 const det=m?`<div style="margin-top:14px;border-radius:14px;border:2px solid ${m.color};padding:14px"><div style="display:flex;gap:12px;align-items:center"><i style="width:44px;height:44px;border-radius:10px;background:${m.color};border:1px solid #0003"></i><div><b style="font-size:19px">${esc(vi?m.vi:m.en)}</b><div class="sub">${vi?'Độ cứng':'Hardness'} ${esc(inf?inf[0]:'—')}</div></div></div>
  <div class="kpi" style="margin:12px 0"><div><span>SFM carbide</span><b>${m.sfmC}</b></div><div><span>SFM HSS</span><b>${m.sfmH}</b></div><div><span>${vi?'RPM dao 1/2"':'RPM 1/2" tool'}</span><b>${rpm(m)}</b></div><div><span>IPT</span><b>${m.cl}</b></div></div>
  ${inf?[[vi?'Dùng làm gì':'Used for',vi?inf[2]:inf[1],'#2457d6'],[vi?'Cách gia công':'How to machine it',vi?inf[4]:inf[3],'#ff6a13'],[vi?'Làm mát':'Coolant',vi?inf[6]:inf[5],'#0a9bb0']].map(r=>`<div style="display:flex;gap:10px;margin-bottom:10px"><i style="flex:none;width:6px;border-radius:3px;background:${r[2]}"></i><div><b>${r[0]}</b><p style="margin:3px 0 0;line-height:1.5">${esc(r[1])}</p></div></div>`).join(''):''}
  ${m.id===S.mat?`<b style="color:#1c9b5f">✓ ${vi?'Đang dùng cho chương trình':'In use for the program'}</b>`:`<button class="btn pri" data-usemat="${m.id}">${vi?'Dùng vật liệu này':'Use this material'}</button>`}</div>`:`<p class="sub" style="margin:10px 0 0">${vi?'Bấm một vật liệu để xem cách dùng.':'Tap a material to see how to use it.'}</p>`;
 return top?`<div class="card" style="--cc:${m?m.color:'#6b737a'};margin-top:14px" id="matDet"><h2>${vi?'Cách dùng':'How to use'}</h2>${det}</div><div class="card" style="--cc:#6b737a;margin-top:14px"><h2>${vi?'Chọn vật liệu':'Pick a material'}</h2>${grid}</div>`:`<div class="card" style="--cc:#6b737a;margin-top:14px"><h2>${vi?'Chọn vật liệu':'Pick a material'}</h2>${grid}${det}</div>`;}
function rMat(){const vi=LANG==='vi';if(!S._mi)S._mi=S.mat;const m=mat();
 $('#main').innerHTML=`<h1>${t('mat')}</h1><p class="sub">${vi?'Bấm một vật liệu để xem cách gia công, tốc độ và làm mát. Vật liệu đang dùng:':'Tap a material to see how to machine it, speeds and coolant. Current material:'} <b style="color:var(--edit)">${esc(vi?m.vi:m.en)}</b></p>
 
 ${matGrid(true)}`;}
function rLearn(){const vi=LANG==='vi',L=vi?'vi':'en',O=vi?'en':'vi';S.learnP=S.learnP||{};const cur=S._lm;
 if(!cur){const done=LEARN.filter(m=>S.learnP[m.id]&&S.learnP[m.id].pass).length;
  $('#main').innerHTML=`<h1>${t('learn')}</h1><p class="sub">${vi?'Bài học ngắn cho thợ và người lập trình, có câu hỏi kiểm tra.':'Short lessons for machinists and programmers, with quick checks.'}</p>
  <div class="kpi" style="margin-bottom:14px"><div><span>${vi?'Đã xong':'Completed'}</span><b>${done} / ${LEARN.length}</b></div></div>
  <div class="tools" style="grid-template-columns:repeat(auto-fill,minmax(min(260px,100%),1fr))">${LEARN.map(m=>{const p=S.learnP[m.id];return`<button class="tcard" data-lm="${m.id}" style="border-top:5px solid ${m.col}"><div class="pic" style="height:auto">${m.pic()}</div><b>${esc(m[L][0])}</b><span>${esc(m[L][1])}</span><span class="${p&&p.pass?'ok':''}" style="font-weight:700">${p&&p.pass?(vi?'✓ Đã xong':'✓ Done'):(vi?'Chưa học':'Not started')}${p?' · '+p.score+'/'+m.quiz.length:''}</span></button>`;}).join('')}</div>`;return;}
 const m=LEARN.find(x=>x.id===cur);const ans=S._la||{};
 $('#main').innerHTML=`<button class="btn sm" data-lm="">← ${t('learn')}</button><h1 style="margin-top:10px">${esc(m[L][0])}</h1><p class="sub">${esc(m[L][1])} <span style="opacity:.7">· ${esc(m[O][0])}</span></p>
 ${(()=>{const e=LEASY[m.id];return e?`<div class="card" style="--cc:${m.col};margin-bottom:14px;background:color-mix(in srgb,${m.col} 9%,var(--panel))"><div style="display:flex;gap:12px;align-items:flex-start"><svg viewBox="0 0 24 24" width="34" height="34" style="flex:none" fill="none" stroke="${m.col}" stroke-width="2"><path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-4 10.5c.8.8 1 1.5 1 2.5h6c0-1 .2-1.7 1-2.5A6 6 0 0 0 12 3z"/></svg><div><b style="font-size:17px">${vi?'Hiểu đơn giản':'In simple words'}</b><p style="margin:4px 0 10px;line-height:1.55;font-size:16px">${esc(vi?e[1]:e[0])}</p><b>${vi?'Ví dụ thực tế':'Real example'}</b><p style="margin:4px 0 0;line-height:1.55">${esc(vi?e[3]:e[2])}</p></div></div></div>`:''})()}
 <div class="grid g2"><div class="card" style="--cc:${m.col}"><h2>${vi?'Hình minh hoạ':'Picture'}</h2>${m.pic()}</div>
 <div class="card" style="--cc:${m.col}"><h2>${vi?'Ý chính':'Key points'}</h2><ol style="margin:0;padding-left:22px;line-height:1.6">${m.pts.map(p=>`<li style="margin-bottom:8px">${esc(vi?p[1]:p[0])}<br><span class="sub" style="font-size:13px">${esc(vi?p[0]:p[1])}</span></li>`).join('')}</ol></div></div>
 ${m.id==='mat'?matGrid():''}
 <div class="card" style="--cc:${m.col};margin-top:14px"><h2>${vi?'Kiểm tra nhanh':'Quick check'}</h2>${m.quiz.map((q,qi)=>{const a=ans[qi];return`<div style="margin-bottom:14px"><p style="margin:0 0 8px;font-weight:700">${qi+1}. ${esc(vi?q[0][1]:q[0][0])}</p><div class="row">${q[1].map((o,oi)=>{const st=a==null?'':oi===q[2]?'background:#1c9b5f;color:#fff;border-color:#1c9b5f':oi===a?'background:#d93a3a;color:#fff;border-color:#d93a3a':'';return`<button class="btn sm" data-lq="${qi}" data-lo2="${oi}" style="${st}" ${a!=null?'disabled':''}>${esc(vi?o[1]:o[0])}</button>`;}).join('')}</div>${a!=null?`<p class="sub" style="margin:6px 0 0">${a===q[2]?(vi?'Đúng! ':'Correct! '):(vi?'Chưa đúng. ':'Not quite. ')}${esc(vi?q[3][1]:q[3][0])}</p>`:''}</div>`;}).join('')}
 <div class="row"><button class="btn" data-act="lqReset">${IC.reset}${vi?'Làm lại':'Retry'}</button>${(()=>{const i=LEARN.indexOf(m),n=LEARN[i+1];return n?`<button class="btn pri" data-lm="${n.id}">${esc(n[L][0])} →</button>`:'';})()}</div></div>`;}

/* ================= SETTINGS ================= */
const SET0={useShop:true,theme:'auto',layout:'auto',pageZoom:true,viewZoom:true,uiScale:100,safeZ:1,retract:0.1,tcSec:45,coolant:true};
function SETS(){return S.set={...SET0,...(S.set||{})};}
function applySettings(){const st=SETS(),de=document.documentElement;if(st.theme==='auto')delete de.dataset.theme;else de.dataset.theme=st.theme;
 de.classList.toggle('land',st.layout==='land');de.classList.toggle('port',st.layout==='port');
 const vm=document.querySelector('meta[name=viewport]');if(vm)vm.setAttribute('content','width=device-width,initial-scale=1,viewport-fit=cover'+(st.pageZoom?'':',maximum-scale=1,user-scalable=no'));
 de.classList.toggle('nozoom',!st.viewZoom);de.style.setProperty('--ui',st.uiScale/100);const m=$('#main');if(m)m.style.zoom=st.uiScale/100;}
function shopSummary(){const L=lessons();const by={};L.forEach(s=>{const k=(s.lathe?'lathe ':'')+s.kind;by[k]=(by[k]||0)+1;});const files=new Set(L.map(s=>s.file)).size;
 return`<div class="kpi" style="margin-bottom:10px"><div><span>${LANG==='vi'?'Mẫu':'Samples'}</span><b>${L.length}</b></div><div><span>${LANG==='vi'?'File':'Files'}</span><b>${files}</b></div></div><div class="legend" style="margin:0 0 10px">${Object.entries(by).sort((a,b)=>b[1]-a[1]).map(([k,v])=>`<span>${esc(k)} <b class="ro">${v}</b></span>`).join('')}</div>
 <p class="sub" style="margin:0 0 6px;font-size:13px">${LANG==='vi'?'Gồm bảng FEED_SPEED_RYAN và các chương trình Haas / Siemens / máy tiện. Ưu tiên bảng feed, nội suy theo đường kính dao; vật liệu chưa có dữ liệu thì dùng công thức chuẩn.':'Includes the FEED_SPEED_RYAN chart and Haas / Siemens / lathe programs. The feed chart wins, interpolated by tool diameter; materials without data use the built-in formulas.'}</p>`;}
function rSettings(){const st=SETS();const seg=(key,opts)=>`<div class="seg">${opts.map(([v,k])=>`<button data-set="${key}" data-v="${v}" class="${String(st[key])===String(v)?'on':''}">${t(k)}</button>`).join('')}</div>`;
 const sw=(key,k)=>`<label class="row" style="gap:10px;font-weight:600;min-height:48px;flex-wrap:nowrap"><span class="sw"><input type="checkbox" data-setsw="${key}" ${st[key]?'checked':''}><i></i></span>${t(k)}</label>`;
 $('#main').innerHTML=`<h1>${t('setTitle')}</h1><p class="sub">${t('setSub')}</p><div class="grid" style="grid-template-columns:repeat(auto-fit,minmax(min(300px,100%),1fr))">
 <div class="card"><h2>${t('display')}</h2><div class="grid" style="gap:12px">
  <div><div class="sub" style="margin:0 0 6px">${t('layout')}</div>${seg('layout',[['auto','lyAuto'],['port','lyPort'],['land','lyLand']])}</div>
  <div><div class="sub" style="margin:0 0 6px">${t('theme')}</div>${seg('theme',[['auto','thAuto'],['light','thLight'],['dark','thDark']])}</div>
  <div><div class="sub" style="margin:0 0 6px">${t('uiScale')} · <b class="ro">${st.uiScale}%</b></div><input type="range" id="uiScale" min="85" max="135" step="5" value="${st.uiScale}"></div>
  ${sw('pageZoom','pageZoom')}${sw('viewZoom','viewZoom')}
  <div><div class="sub" style="margin:0 0 6px">${LANG==='vi'?'Ngôn ngữ':'Language'}</div><div class="seg"><button data-l="vi" class="${LANG==='vi'?'on':''}">Tiếng Việt</button><button data-l="en" class="${LANG==='en'?'on':''}">English</button></div></div>
  <div><div class="sub" style="margin:0 0 6px">${t('units')}</div><div class="seg"><button data-u="in" class="${S.units==='in'?'on':''}">inch</button><button data-u="mm" class="${S.units==='mm'?'on':''}">mm</button></div></div></div></div>
 <div class="card"><h2>${t('machDefs')}</h2><div class="fields">${inp('safeZ',fl(st.safeZ),'data-sb="safeZ" data-u="L"')}${inp('retractZ',fl(st.retract),'data-sb="retract" data-u="L"')}${inp('tcSec',st.tcSec,'data-sb="tcSec" data-u="N"')}
  <label class="f">${t('post')}<select id="postSel2">${[['prototrak','ProtoTRAK'],['haas','Haas'],['fanuc','Fanuc'],['siemens','Siemens 840D']].map(([v,l])=>`<option value="${v}" ${S.post===v?'selected':''}>${l}</option>`).join('')}</select></label>
  <label class="f">${t('fileType')}<select id="extSel">${['gcd','cam','nc','ncc','tap','mpf','txt'].map(x=>`<option ${(S.ext||'gcd')===x?'selected':''}>${x}</option>`).join('')}</select></label></div>
  <div class="row" style="margin-top:8px">${sw('coolant','coolant')}<label class="row" style="gap:10px;font-weight:600;min-height:48px"><span class="sw"><input type="checkbox" id="tsChk" ${S.toolStop?'checked':''}><i></i></span>M00</label><label class="row" style="gap:10px;font-weight:600;min-height:48px"><span class="sw"><input type="checkbox" id="lnChk" ${S.lineNums?'checked':''}><i></i></span>N#</label></div>
  <button class="btn sm" data-tab="program" style="margin-top:6px">${t('defs')} →</button></div>
 <div class="card"><h2>${LANG==='vi'?'Dữ liệu xưởng (app đã học)':'Shop data (learned)'}</h2>${shopSummary()}${sw('useShop','useShopL')}<button class="btn sm" data-act="importJson">${IC.file}${LANG==='vi'?'Nhập thêm bài học (.json)':'Add lessons (.json)'}</button></div>
 <div class="card"><h2>${t('dataT')}</h2><div class="grid" style="gap:10px"><button class="btn go" data-act="projSave">${IC.save}${t('exportProj')}</button><button class="btn" data-act="importJson">${IC.file}${t('importProj')}</button><button class="btn" data-act="resetAll" style="color:var(--bad)">${IC.del}${t('resetAll')}</button></div></div>
 <div class="card"><h2>${t('about')}</h2><p style="margin:0 0 10px">MINI CAM · ${t('createdBy')}</p><button class="btn sm" data-tab="about">${t('about')} →</button></div></div>`;}
const APPVER='1.0 · 2026-11';
function rAbout(){const vi=LANG==='vi';const B=(en,v)=>vi?v:en;
 const sec=(title,body,col)=>`<div class="card" style="--cc:${col}"><h2>${title}</h2>${body}</div>`;
 $('#main').innerHTML=`<div class="card" style="--cc:#2457d6;display:flex;gap:16px;align-items:center;flex-wrap:wrap;margin-bottom:14px"><span style="width:84px;height:84px;flex:none">${document.querySelector('.lg').innerHTML.replace('width="40" height="40"','width="84" height="84"')}</span>
  <div style="flex:1;min-width:200px"><h1 style="margin:0">MINI <span class="grad">CAM</span></h1><p style="margin:4px 0 0;font-weight:600">${t('tagline')}</p><p class="sub" style="margin:4px 0 0">${B('Version','Phiên bản')} ${APPVER} · ${t('createdBy')}</p></div></div>
 <div class="grid" style="grid-template-columns:repeat(auto-fit,minmax(min(320px,100%),1fr))">
 ${sec(B('What it is','Ứng dụng làm gì'),`<p style="margin:0;line-height:1.6">${B('MINI CAM turns drawings and models (DXF, PDF, STL, STEP) into CNC programs for many machines: ProtoTRAK knee and bed mills, Haas VF and UMC, DMG MORI DMU / DMV and lathes (Haas ST-10, DMG MORI NLX). It covers 2.5D, 3D, 4th-axis and 5-axis toolpaths, sheet nesting with tabs, a material-removal simulator, shop calculators and a bilingual setup sheet.','MINI CAM biến bản vẽ và mô hình (DXF, PDF, STL, STEP) thành chương trình CNC cho nhiều loại máy: máy phay ProtoTRAK (đứng và giường), Haas VF và UMC, DMG MORI DMU / DMV và máy tiện (Haas ST-10, DMG MORI NLX). Có đường dao 2.5D, 3D, trục 4 và trục 5, xếp chi tiết trên tấm có tab, mô phỏng cắt gọt, máy tính xưởng và phiếu setup song ngữ.')}</p>`,'#2457d6')}
 ${sec(B('Safety first','An toàn trên hết'),`<ul style="margin:0;padding-left:20px;line-height:1.65">
  <li>${B('Every program must be checked by a qualified machinist before it runs.','Mọi chương trình phải được thợ có chuyên môn kiểm tra trước khi chạy.')}</li>
  <li>${B('Run the simulator, then dry-run with Z raised and feed override low; watch the first plunge of every tool.','Chạy mô phỏng, rồi chạy thử với Z nâng và giảm feed; quan sát lần ăn xuống đầu tiên của mỗi dao.')}</li>
  <li>${B('Check tool length offsets, work offsets (G54…), rotary positions and clamping before cycle start.','Kiểm tra bù chiều dài dao, gốc phôi (G54…), vị trí trục xoay và kẹp phôi trước khi bấm chạy.')}</li>
  <li>${B('Feeds and speeds are starting values only — adjust for your machine, holder, stick-out and coolant.','Tốc độ và bước tiến chỉ là giá trị khởi đầu — chỉnh theo máy, đầu kẹp, độ nhô dao và nước làm mát.')}</li>
  <li>${B('4th / 5th-axis and lathe output, Siemens cycles and ProtoTRAK conversion have not been proven on every control. Verify kinematics, cycle parameters and limits in your machine manual.','G-code trục 4 / trục 5, máy tiện, chu trình Siemens và chuyển đổi ProtoTRAK chưa được kiểm chứng trên mọi bộ điều khiển. Đối chiếu động học, thông số chu trình và giới hạn hành trình với tài liệu máy.')}</li>
  <li>${B('Wear safety glasses, keep doors closed, never reach into a running machine.','Đeo kính bảo hộ, đóng cửa máy, không bao giờ thò tay vào máy đang chạy.')}</li></ul>`,'#d93a3a')}
 ${sec(B('No warranty','Không bảo hành'),`<p style="margin:0;line-height:1.6">${B('MINI CAM is provided "as is", without warranty of any kind. The author is not responsible for damage to machines, tools, parts or people resulting from its use. You are responsible for the programs you run.','MINI CAM được cung cấp "nguyên trạng", không có bảo hành dưới bất kỳ hình thức nào. Tác giả không chịu trách nhiệm về hư hỏng máy, dao, chi tiết hay tai nạn do việc sử dụng ứng dụng. Người dùng chịu trách nhiệm về chương trình mình cho chạy.')}</p>`,'#e39b00')}
 ${sec(B('Author & copyright','Tác giả & bản quyền'),`<p style="margin:0 0 8px;line-height:1.6"><b>${t('createdBy')}</b></p><p style="margin:0;line-height:1.6">© 2026 Ryan Nguyen. ${B('All rights reserved. Do not copy, redistribute or sell this app or its code without written permission from the author.','Bảo lưu mọi quyền. Không sao chép, phân phối lại hay bán ứng dụng hoặc mã nguồn khi chưa có sự cho phép bằng văn bản của tác giả.')}</p>`,'#8b4fd6')}
 ${sec(B('Trademarks','Nhãn hiệu'),`<p style="margin:0;line-height:1.6">${B('ProtoTRAK and TRAK are trademarks of Southwestern Industries, Inc. Haas, DMG MORI, Siemens / SINUMERIK, FANUC, Autodesk Fusion and other names belong to their owners. They are used only to describe compatibility; MINI CAM is not affiliated with or endorsed by them. Machine specifications are taken from public listings and may differ from your machine.','ProtoTRAK và TRAK là nhãn hiệu của Southwestern Industries, Inc. Haas, DMG MORI, Siemens / SINUMERIK, FANUC, Autodesk Fusion và các tên khác thuộc về chủ sở hữu. Các tên này chỉ dùng để nói về khả năng tương thích; MINI CAM không liên kết và không được các hãng này bảo trợ. Thông số máy lấy từ nguồn công khai và có thể khác với máy của bạn.')}</p>`,'#0a9bb0')}
 ${sec(B('Your data','Dữ liệu của bạn'),`<p style="margin:0;line-height:1.6">${B('Drawings, programs and settings stay on this device (browser storage). Nothing is uploaded. Clearing the browser data or tapping Reset in Settings removes them — save a project file to keep a copy.','Bản vẽ, chương trình và cài đặt chỉ lưu trên thiết bị này (bộ nhớ trình duyệt). Không có gì được tải lên. Xoá dữ liệu trình duyệt hoặc bấm Xoá hết trong Cài đặt sẽ mất dữ liệu — hãy lưu file dự án để giữ bản sao.')}</p>`,'#1c9b5f')}
 ${sec(B('Open-source parts','Thành phần mã nguồn mở'),`<ul style="margin:0;padding-left:20px;line-height:1.65"><li>pdf.js — Mozilla, Apache License 2.0 (${B('PDF import','đọc PDF')})</li><li>html2canvas — MIT License (${B('setup sheet PDF','phiếu setup PDF')})</li><li>Barlow, JetBrains Mono — SIL Open Font License</li></ul>`,'#5c6b7a')}
 </div><p class="sub" style="text-align:center;margin:18px 0 0">MINI CAM ${APPVER} · © 2026 Ryan Nguyen</p>`;}

/* ================= HELP (searchable) ================= */
const HELP=[
 {tab:'program',en:['Getting started','1. Pick your machine and material at the top. 2. Program tab → Import file (DXF, PDF, STL, STEP or a photo) or tap Demo part. 3. Check the stock, part thickness and X0/Y0 corner. 4. Tap Auto program. 5. Look at the 2D / 3D view and the Simulator. 6. Save the G-code file and copy it to a USB stick.'],vi:['Bắt đầu','1. Chọn máy và vật liệu ở trên cùng. 2. Tab Chương trình → Nhập file (DXF, PDF, STL, STEP hoặc ảnh) hoặc bấm Chi tiết mẫu. 3. Kiểm tra phôi, chiều dày chi tiết và góc X0/Y0. 4. Bấm Tự động lập trình. 5. Xem hình 2D / 3D và tab Mô phỏng. 6. Lưu file G-code và chép sang USB.']},
 {tab:'program',en:['Import formats','DXF: lines, arcs, circles, polylines, splines, ellipses (explode blocks first). DWG: save as DXF in your CAD. PDF: vector lines on page 1, title block and dimensions are filtered; tap a feature to exclude it. STL: pocket and hole depths are read from the model and 3D toolpaths become available. STEP: flat faces, pockets and holes (2.5D). Photo: shown as a reference on the setup sheet.'],vi:['Định dạng nhập','DXF: line, arc, circle, polyline, spline, ellipse (explode block trước). DWG: lưu sang DXF trong phần mềm CAD. PDF: đọc nét vẽ trang 1, tự bỏ khung tên và kích thước; chạm vào đặc trưng để loại. STL: độ sâu hốc và lỗ lấy từ mô hình, mở được đường dao 3D. STEP: mặt phẳng, hốc và lỗ (2.5D). Ảnh: hiện làm hình tham khảo trên phiếu setup.']},
 {tab:'program',en:['Stock, zero and program defaults','Stock height = part thickness + face allowance + grip in jaws + safety (e.g. 1.000 + .030 + .300 + .100). X0/Y0: lower-left, upper-left, lower-right or centre. Z0 is always the top of the finished part. Program defaults: rough DOC per pass (.250), leave for finish (.010), finish full depth in one pass, drill cycle, default pocket depth.'],vi:['Phôi, điểm 0 và mặc định lập trình','Chiều cao phôi = chiều dày chi tiết + lượng phay mặt + phần kẹp hàm + an toàn (ví dụ 1.000 + .030 + .300 + .100). X0/Y0: góc dưới trái, trên trái, dưới phải hoặc tâm. Z0 luôn ở mặt trên chi tiết hoàn thiện. Mặc định: ăn sâu thô mỗi lớp (.250), chừa tinh (.010), tinh hết chiều sâu 1 lần, chu trình khoan, độ sâu hốc mặc định.']},
 {tab:'program',en:['Operations list','Each card is one operation. Tap it to open. Green values can be edited, orange values are calculated. Turn Auto feeds off to type your own RPM/feed. Use the arrows to change the order, the switch to skip an operation. Summary shows passes, e.g. "4 passes × 0.250".'],vi:['Danh sách nguyên công','Mỗi thẻ là một nguyên công. Chạm để mở. Số màu xanh sửa được, số màu cam là số tự tính. Tắt Tự tính tốc độ để tự nhập RPM/bước tiến. Mũi tên để đổi thứ tự, công tắc để bỏ qua. Dòng tóm tắt có số lớp, ví dụ "4 lớp × 0.250".']},
 {tab:'program',en:['2.5D strategies','Face · Adaptive (offset HSM, constant step-over) · Pocket (offset or zigzag) · Contour (rough with step-down and leave, finish full depth, arc lead-in/out) · Rest machining (smaller tool cleans corners) · Slot / trochoidal slot · Chamfer · Corner radius · V-carve · Fluting · Moulding (cove, bead, ogee, V along a rail). Entry: helical, ramp or plunge. Corner feed % slows the feed at inside corners.'],vi:['Chiến lược 2.5D','Phay mặt · Adaptive (offset HSM, bước ngang đều) · Phay hốc (theo biên hoặc zigzag) · Contour (thô từng lớp có chừa, tinh hết chiều sâu, vào/ra cung tròn) · Rest (dao nhỏ phay góc còn sót) · Phay rãnh / rãnh trochoidal · Vát mép · Bo góc · Khắc V · Fluting · Moulding (lõm, lồi, chữ S, V theo đường dẫn). Vào dao: xoắn ốc, xuống dốc hoặc cắm thẳng. Feed ở góc % giảm bước tiến ở góc trong.']},
 {tab:'program',en:['Holes and drill cycles','Spot drill G82 (dwell). Drill G81, G82, G83 (full-retract peck) or G73 (chip break). Tap G84 with feed = RPM × pitch. Ream G85. Bore G85/G86. Holes bigger than .500 are helical-bored with an end mill. Tap-drill sizes (e.g. .201) automatically add the matching tap (1/4-20).'],vi:['Lỗ và chu trình khoan','Khoan mồi G82 (dừng đáy). Khoan G81, G82, G83 (mổ rút hết) hoặc G73 (bẻ phoi). Taro G84, bước tiến = RPM × bước ren. Doa G85. Móc lỗ G85/G86. Lỗ lớn hơn .500 phay xoắn ốc bằng dao phay. Lỗ có cỡ mũi khoan taro (ví dụ .201) tự thêm taro tương ứng (1/4-20).']},
 {tab:'program',en:['3D, 4th and 5th axis','3D (needs STL): Z-level roughing, parallel, waterline, radial, scallop, morph spiral. 4th axis (rotary on the table, A around X, Z0 on the centreline): index (A angle per operation), wrap a 2D drawing around a diameter, rotary roughing, rotary finishing (spiral). 5th axis: 3+2 (B/C angles + work offset), draft-wall swarf, flow with lead/lag/lean and max tilt, 45° deburr. 5-axis output uses TCPC (G234 on Haas, TRAORI on Siemens). Always verify kinematics on the machine.'],vi:['3D, trục 4 và trục 5','3D (cần STL): thô theo lớp Z, tinh song song, đường đồng mức, hướng tâm, scallop, xoắn morph. Trục 4 (bàn xoay, A quanh X, Z0 ở tâm trục): xoay góc A cho từng nguyên công, quấn hình 2D quanh trụ, phay thô tròn xoay, phay tinh tròn xoay (xoắn). Trục 5: 3+2 (góc B/C + gốc phôi), vách nghiêng swarf, flow có lead/lag/lean và góc nghiêng tối đa, vát cạnh 45°. G-code 5 trục dùng TCPC (G234 trên Haas, TRAORI trên Siemens). Luôn kiểm tra động học trên máy.']},
 {tab:'nest',en:['Nest parts on a sheet','Pick parts and quantities (0 = as many as fit). Set sheet size, thickness, tab width/thickness and contour tool. Orange = tabs, green = screw holes. Order: screw holes → face → holes → pockets → contour with tabs → measure (M00) → remove tabs. The tab check estimates a safety factor for 6061-T6 and 4130; keep it ≥ 2.'],vi:['Xếp chi tiết trên tấm','Chọn chi tiết và số lượng (0 = xếp tối đa). Nhập kích thước tấm, dày, rộng/dày tab và dao contour. Cam = tab, xanh lá = lỗ vít. Thứ tự: lỗ vít → phay mặt → lỗ → hốc → contour chừa tab → đo (M00) → gỡ tab. Phần kiểm tra tab ước lượng hệ số an toàn cho 6061-T6 và 4130; giữ ≥ 2.']},
 {tab:'tools',en:['Tools','Tap a milling tool to edit diameter, flutes, flute length, coating, tip angle, pitch. Lathe tools show the insert shape (CNMG 80°, DNMG 55°, VNMG 35°). Import a Fusion 360 tool library (.json) or a simple list. Copy the library as JSON to back it up.'],vi:['Dao cụ','Chạm vào dao phay để sửa đường kính, số me, chiều dài me, lớp phủ, góc mũi, bước ren. Dao tiện có hình mảnh dao (CNMG 80°, DNMG 55°, VNMG 35°). Nhập thư viện dao Fusion 360 (.json) hoặc danh sách đơn giản. Chép thư viện dạng JSON để sao lưu.']},
 {tab:'fixtures',en:['Fixtures','Choose vise, soft jaws, strap clamps, fixture plate, 5C collet block or angle plate. Parallels are set so the jaws grip exactly the grip height. Red warning means the cutter can reach the jaws.'],vi:['Đồ gá','Chọn ê-tô, hàm mềm, kẹp bàn, tấm gá, khối collet 5C hoặc ke góc. Căn đệm tự đặt để hàm kẹp đúng phần kẹp. Cảnh báo đỏ nghĩa là dao có thể chạm hàm.']},
 {tab:'sim',en:['Simulator','Play, pause, reset, next operation, speed and scrub bar. 3D or top view, HD for more detail. Colour by operation, tool or depth. XYZ / A switch shows the 4th-axis cylinder. 5-axis cuts with the tilted tool. Red "Rapid into stock" means a G00 move hits material. 3+2 indexed operations are not simulated.'],vi:['Mô phỏng','Chạy, dừng, làm lại, NC tiếp, tốc độ và thanh kéo. Xem 3D hoặc từ trên, Nét cao để rõ hơn. Tô màu theo nguyên công, dao hoặc độ sâu. Nút XYZ / A để xem phôi trụ trục 4. 5 trục cắt bằng dao nghiêng. Chữ đỏ "Chạy nhanh đâm vào phôi" nghĩa là lệnh G00 chạm vật liệu. Nguyên công 3+2 chưa mô phỏng.']},
 {tab:'calc',en:['Calculators','Speeds & feeds with chip thinning and spindle HP, tap drill chart, bolt circle (adds holes to the part), chamfer depth, inch ↔ mm.'],vi:['Máy tính','Tốc độ & bước tiến có chip thinning và công suất HP, bảng mũi khoan taro, lỗ trên vòng tròn (thêm lỗ vào chi tiết), độ sâu vát, đổi inch ↔ mm.']},
 {tab:'setup',en:['Setup sheet','Fill in part, operator and notes, then Save PDF (needs internet the first time) or Save HTML. English and Vietnamese on the same sheet: zero, fixture drawing, tool list with pictures, operations and step-by-step instructions.'],vi:['Phiếu setup','Điền chi tiết, thợ đứng máy và ghi chú, rồi Lưu PDF (lần đầu cần mạng) hoặc Lưu HTML. Song ngữ Anh–Việt trên cùng phiếu: điểm 0, hình đồ gá, danh sách dao có hình, nguyên công và các bước hướng dẫn.']},
 {tab:'program',en:['Lathe','Choose Haas ST-10 or DMG MORI NLX 2500. The Program tab becomes a turning program: demo shaft or DXF half-section (X axial, Y radius). Face, OD rough, OD finish (G42), groove, thread (G32/G33 passes), center drill, part off. X in diameter, Z0 at the face, G96 constant surface speed with a max RPM.'],vi:['Máy tiện','Chọn Haas ST-10 hoặc DMG MORI NLX 2500. Tab Chương trình đổi sang tiện: trục mẫu hoặc DXF nửa mặt cắt (X dọc trục, Y bán kính). Khỏa mặt, tiện thô, tiện tinh (G42), cắt rãnh, tiện ren (G32/G33 nhiều lượt), khoan tâm, cắt đứt. X theo đường kính, Z0 ở mặt đầu, G96 tốc độ cắt không đổi có giới hạn RPM.']},
 {tab:'program',en:['Saving G-code for your control','ProtoTRAK: .gcd runs G-code, .cam converts to conversational (then save on the control as .pt4 / .pt10); may need the Converters option. Haas: .nc. Siemens 840D: .mpf (CYCLE81–86, CYCLE800, TRAORI). Files are saved inside a .zip — tap it in the Files app to unzip.'],vi:['Lưu G-code cho bộ điều khiển','ProtoTRAK: .gcd chạy G-code, .cam đổi sang chương trình hội thoại (rồi lưu trên máy thành .pt4 / .pt10); có thể cần tuỳ chọn Converters. Haas: .nc. Siemens 840D: .mpf (CYCLE81–86, CYCLE800, TRAORI). File được nén trong .zip — chạm vào trong ứng dụng Tệp để giải nén.']},
 {tab:'settings',en:['Settings','Layout: auto, portrait or landscape. Theme, text size, pinch-zoom on/off for the page and for drawings. Safe Z, retract, tool-change time, default post and file type, coolant, M00, line numbers. Save or open a whole project (.json), or reset everything.'],vi:['Cài đặt','Bố cục: tự động, dọc hoặc ngang. Giao diện, cỡ chữ, bật/tắt zoom cho trang và cho hình vẽ. Z an toàn, nhấc dao, thời gian thay dao, hậu xử lý và loại file mặc định, nước làm mát, M00, số dòng. Lưu hoặc mở cả dự án (.json), hoặc xoá hết làm lại.']},
 {tab:'settings',en:['Shop data (learned feeds)','MINI CAM learned from 29 shop files: the FEED_SPEED_RYAN chart (drills, taps, reamers, spot drills, end mills, TrueMill adaptive, face mill) and past Haas / Siemens / lathe programs. When an operation matches the material, tool type and tool material, the app uses the chart first (interpolated by diameter), otherwise past programs within 0.5–2× the diameter. The operation note shows "Shop data ×n". Turn it off in Settings. Add more lessons with a .json file.'],vi:['Dữ liệu xưởng (tốc độ đã học)','MINI CAM đã học từ 29 file của xưởng: bảng FEED_SPEED_RYAN (mũi khoan, taro, doa, khoan mồi, dao phay, TrueMill adaptive, dao phay mặt) và các chương trình Haas / Siemens / máy tiện cũ. Khi nguyên công khớp vật liệu, loại dao và vật liệu dao, app dùng bảng feed trước (nội suy theo đường kính), nếu không có thì lấy từ chương trình cũ có đường kính trong khoảng 0.5–2 lần. Ghi chú nguyên công hiện "Dữ liệu xưởng ×n". Tắt được trong Cài đặt. Thêm bài học bằng file .json.']},
 {tab:'help',en:['Safety checklist','Check every first plunge with Z raised. Verify tool length offsets. Check that the work offset matches the setup sheet. Use the simulator before every new program. Feeds and speeds are starting values — listen to the cut and adjust.'],vi:['Kiểm tra an toàn','Chạy thử lần ăn xuống đầu tiên với Z nâng. Kiểm tra bù chiều dài dao. Kiểm tra gốc phôi khớp với phiếu setup. Dùng mô phỏng trước mỗi chương trình mới. Tốc độ và bước tiến chỉ là giá trị khởi đầu — nghe tiếng cắt và chỉnh lại.']},
 {tab:'mat',en:['Materials','Tap the Materials tab. Pick a metal or plastic to see hardness, cutting speed, RPM for a 1/2" tool, what it is used for, how to machine it and which coolant to use. Tap Use this material to switch the program and recalculate feeds.'],vi:['Vật liệu','Bấm tab Vật liệu. Chọn kim loại hoặc nhựa để xem độ cứng, tốc độ cắt, RPM cho dao 1/2", dùng làm gì, cách gia công và cách làm mát. Bấm Dùng vật liệu này để đổi vật liệu chương trình và tính lại feed.']},
];
const HT=(en,vi)=>LANG==='vi'?vi:en;
const HB=(x,y,w,h,c,t,tc)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="9" fill="${c}"/><text x="${x+w/2}" y="${y+h/2+4}" text-anchor="middle" fill="${tc||'#fff'}" font-size="11">${t}</text>`;
const ARW=(x1,y1,x2,y2)=>`<path d="M${x1} ${y1}L${x2} ${y2}" stroke="#6b737a" stroke-width="2" marker-end="url(#ah)"/>`;
const AHD=`<defs><marker id="ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0L10 5L0 10z" fill="#6b737a"/></marker></defs>`;
const HPIC=[
 ()=>SV(330,150,AHD+[[HT('Machine','Chọn máy'),'#2457d6'],[HT('Import','Nhập file'),'#0a9bb0'],[HT('Stock','Phôi'),'#1c9b5f'],[HT('Auto','Tự động'),'#ff6a13'],[HT('Simulate','Mô phỏng'),'#8b4fd6'],[HT('Save','Lưu G-code'),'#d93a3a']].map((s,i)=>{const x=10+(i%3)*110,y=i<3?20:90;return HB(x,y,90,40,s[1],(i+1)+'. '+s[0])+(i%3<2?ARW(x+90,y+20,x+108,y+20):'')}).join('')+ARW(280,62,40,88)),
 ()=>SV(330,140,AHD+['DXF','PDF','STL','STEP','IMG'].map((f,i)=>`<path d="M${12+i*42} 20h28l8 8v40h-36z" fill="#e9edf2" stroke="#6b737a"/><text x="${28+i*42}" y="55" text-anchor="middle" font-size="10" fill="${['#2457d6','#d93a3a','#1c9b5f','#8b4fd6','#e39b00'][i]}">${f}</text>`).join('')+ARW(220,45,245,45)+`<rect x="250" y="15" width="70" height="60" rx="6" fill="none" stroke="#14181c" stroke-width="2"/><circle cx="270" cy="35" r="7" fill="none" stroke="#14181c"/><rect x="282" y="45" width="28" height="20" rx="4" fill="none" stroke="#14181c"/>`+LBL(12,105,HT('Tap Import, pick a file — features are found automatically','Bấm Nhập file, chọn file — app tự tìm lỗ, hốc, biên dạng'))+LBL(12,125,HT('DWG → save as DXF first','DWG → lưu sang DXF trước'),'#b54200')),
 ()=>SV(330,185,`<rect x="40" y="100" width="40" height="55" fill="#a8afb5"/><rect x="200" y="100" width="40" height="55" fill="#a8afb5"/><rect x="80" y="30" width="120" height="125" fill="#d7dbdf" stroke="#6b737a"/><rect x="80" y="30" width="120" height="6" fill="#ff6a13"/><rect x="80" y="36" width="120" height="60" fill="#5b83ea"/><rect x="80" y="96" width="120" height="4" fill="#e39b00"/>`+LBL(250,36,HT('Face .030','Phay mặt .030'),'#b54200')+LBL(250,70,HT('Part 1.000','Chi tiết 1.000'),'#2457d6')+LBL(250,102,HT('Safety .100','An toàn .100'),'#8a5a00')+LBL(250,130,HT('Grip .300','Kẹp hàm .300'))+LBL(40,22,HT('Stock = 1.000+.030+.100+.300 = 1.430','Phôi = 1.000+.030+.100+.300 = 1.430'),'#14181c')+`<circle cx="80" cy="36" r="5" fill="#d93a3a"/>`+LBL(10,178,HT('Red dot = Z0 top of part','Chấm đỏ = Z0 mặt trên chi tiết'),'#d93a3a')),
 ()=>SV(330,150,[['Face','Phay mặt','#2457d6',1],['Adaptive','Adaptive','#ff6a13',1],['Contour','Contour','#1c9b5f',1],['Drill','Khoan','#8b4fd6',0]].map((o,i)=>`<rect x="10" y="${10+i*34}" width="310" height="28" rx="8" fill="#f2f4f6"/><rect x="10" y="${10+i*34}" width="6" height="28" fill="${o[2]}"/><text x="26" y="${29+i*34}" font-size="12">${i+1}. ${HT(o[0],o[1])}</text><rect x="270" y="${16+i*34}" width="36" height="16" rx="8" fill="${o[3]?'#1c9b5f':'#c9ced3'}"/><circle cx="${o[3]?298:278}" cy="${24+i*34}" r="6" fill="#fff"/>`).join('')),
 ()=>LEARN.find(m=>m.id==='s25').pic(),
 ()=>SV(330,150,`${[0,1,2,3].map(i=>`<rect x="${30+i*75}" y="20" width="40" height="100" fill="#e9edf2" stroke="#9aa3ab"/>`).join('')}<path d="M50 20v12" stroke="#2457d6" stroke-width="10"/><path d="M125 20v80" stroke="#8b4fd6" stroke-width="10"/><path d="M200 20v90" stroke="#e39b00" stroke-width="8" stroke-dasharray="3 2"/><path d="M275 20v95" stroke="#1c9b5f" stroke-width="12"/><path d="M140 30h12M140 55h12M140 80h12" stroke="#d93a3a"/>`+LBL(28,138,HT('1 Spot','1 Mồi'),'#2457d6')+LBL(100,138,HT('2 Drill G83','2 Khoan G83'),'#8b4fd6')+LBL(180,138,HT('3 Tap G84','3 Taro G84'),'#8a5a00')+LBL(255,138,HT('4 Ream','4 Doa'),'#1c9b5f')+LBL(158,58,HT('peck','mổ'),'#d93a3a')),
 ()=>SV(330,130,`<path d="M10 100 C40 40 80 40 100 100" fill="#e9edf2" stroke="#e0457b" stroke-width="2"/><ellipse cx="165" cy="60" rx="12" ry="35" fill="#c9ced3"/><rect x="165" y="25" width="55" height="70" fill="#dfe4e9"/><ellipse cx="220" cy="60" rx="12" ry="35" fill="#c9ced3" stroke="#c48a00"/><g transform="rotate(25 290 60)"><rect x="283" y="15" width="14" height="45" fill="#c9ced3" stroke="#5c6bc0"/></g><path d="M250 100 C270 70 310 70 325 100" fill="#e9edf2" stroke="#5c6bc0"/>`+LBL(30,122,'3D','#e0457b')+LBL(160,122,HT('4th axis','Trục 4'),'#c48a00')+LBL(270,122,HT('5-axis','5 trục'),'#5c6bc0')),
 ()=>SV(330,162,`<rect x="10" y="10" width="310" height="130" fill="#eef1f4" stroke="#9aa3ab"/>${[[20,20,90,55],[120,20,90,55],[220,20,90,55],[20,80,140,50],[170,80,140,50]].map(r=>`<rect x="${r[0]}" y="${r[1]}" width="${r[2]}" height="${r[3]}" rx="6" fill="#fff" stroke="#2457d6" stroke-width="2"/><rect x="${r[0]+r[2]/2-6}" y="${r[1]-3}" width="12" height="6" fill="#ff6a13"/><rect x="${r[0]+r[2]/2-6}" y="${r[1]+r[3]-3}" width="12" height="6" fill="#ff6a13"/>`).join('')}<circle cx="15" cy="15" r="3" fill="#d93a3a"/><circle cx="315" cy="135" r="3" fill="#d93a3a"/>`+LBL(110,156,HT('orange = tabs','cam = tab giữ'),'#b54200')),
 ()=>LEARN.find(m=>m.id==='tools').pic(),
 ()=>LEARN.find(m=>m.id==='fix').pic(),
 ()=>SV(330,150,`<rect x="10" y="10" width="310" height="130" rx="8" fill="#1b2026"/><path d="M40 40h250v70H40z" fill="none" stroke="#2457d6" stroke-width="3"/><path d="M60 55h210v40H60z" fill="none" stroke="#ff6a13" stroke-width="3"/><path d="M80 70h170" stroke="#1c9b5f" stroke-width="3"/><path d="M20 20L40 40" stroke="#d93a3a" stroke-dasharray="4 3"/><circle cx="250" cy="70" r="8" fill="#f2c14e"/><path d="M110 132h20l-8-8M110 132l12 -8" stroke="#fff"/><circle cx="165" cy="128" r="8" fill="#fff"/><path d="M162 124l7 4-7 4z" fill="#1b2026"/>`+LBL(185,132,HT('Play · color by op','Chạy · màu theo bước'),'#fff')+LBL(24,24,HT('red dashed = rapid','đỏ gạch = chạy nhanh'),'#ff8a8a')),
 ()=>SV(330,130,`<rect x="10" y="10" width="310" height="110" rx="10" fill="#f2f4f6"/>`+LBL(24,36,HT('Diameter','Đường kính')+'  0.500')+LBL(24,60,'SFM  400')+`<rect x="20" y="74" width="290" height="1" fill="#c9ced3"/>`+LBL(24,98,'RPM = 400 × 3.82 ÷ 0.5 =','#2457d6')+`<text x="300" y="98" text-anchor="end" font-size="16" fill="#ff6a13">3056</text>`+LBL(200,36,HT('green = edit','xanh = sửa được'),'#1c9b5f')+LBL(200,60,HT('orange = result','cam = kết quả'),'#b54200')),
 ()=>SV(330,160,`<rect x="80" y="8" width="170" height="145" fill="#fff" stroke="#6b737a"/><rect x="80" y="8" width="170" height="22" fill="#2457d6"/>`+LBL(90,23,'SETUP SHEET','#fff')+`<rect x="90" y="38" width="70" height="50" fill="#e9edf2"/><rect x="168" y="38" width="72" height="50" fill="#dfe4e9"/>${[0,1,2,3].map(i=>`<rect x="90" y="${96+i*13}" width="150" height="9" fill="${i%2?'#f2f4f6':'#e9edf2'}"/>`).join('')}`+LBL(260,40,HT('Part view','Hình chi tiết'))+LBL(260,100,HT('Tool list','Danh sách dao'))+LBL(4,60,HT('Fixture','Đồ gá'))+LBL(4,140,'PDF / HTML','#d93a3a')),
 ()=>SV(330,140,`<rect x="10" y="40" width="40" height="60" fill="#7d848a"/><path d="M50 55h120v-10h60v50h-60v-10H50z" fill="#d7dbdf" stroke="#6b737a"/><path d="M190 30l14 14h-28z" fill="#f2c14e" stroke="#7a5b12" transform="translate(0 -4)"/><path d="M50 70h270" stroke="#888" stroke-dasharray="6 3"/>`+LBL(60,125,HT('X = diameter, Z = length · Z0 at face','X = đường kính, Z = chiều dài · Z0 ở mặt đầu'))+LBL(10,30,HT('Chuck','Mâm cặp'))),
 ()=>SV(330,120,AHD+HB(10,35,70,45,'#2457d6',HT('MINI CAM','MINI CAM'))+ARW(80,57,100,57)+HB(102,35,60,45,'#e39b00','.zip')+ARW(162,57,182,57)+HB(184,35,60,45,'#1c9b5f','USB')+ARW(244,57,264,57)+HB(266,35,58,45,'#14181c',HT('Machine','Máy'))+LBL(10,105,'.gcd · .nc · .tap · .mpf · .cam')),
 ()=>SV(330,140,[[HT('Layout: auto / portrait / landscape','Bố cục: tự động / dọc / ngang'),1],[HT('Pinch zoom','Phóng to bằng 2 ngón'),1],[HT('Use shop data','Dùng dữ liệu xưởng'),1],[HT('Block numbers N#','Số dòng N#'),0]].map((r,i)=>`<text x="14" y="${30+i*32}" font-size="12">${r[0]}</text><rect x="270" y="${17+i*32}" width="40" height="20" rx="10" fill="${r[1]?'#1c9b5f':'#c9ced3'}"/><circle cx="${r[1]?300:280}" cy="${27+i*32}" r="7" fill="#fff"/>`).join('')),
 ()=>SV(330,140,[38,62,80,92,100,96].map((h,i)=>`<rect x="${30+i*45}" y="${120-h}" width="30" height="${h}" rx="4" fill="${i===4?'#ff6a13':'#5b83ea'}"/>`).join('')+`<path d="M20 120h300" stroke="#6b737a"/>`+LBL(150,14,'≈ 3000 RPM','#b54200')+LBL(20,136,HT('Your chart → feeds used first','Bảng feed của bạn → dùng trước'))),
 ()=>SV(330,160,[[HT('Safety glasses, doors closed','Đeo kính, đóng cửa máy')],[HT('Check tool length & offsets','Kiểm tra chiều dài dao & offset')],[HT('Dry run above the part','Chạy thử trên không')],[HT('Rapid 25%, single block first','Rapid 25%, chạy từng dòng trước')],[HT('Hand on feed hold / E-stop','Tay sẵn trên Feed hold / E-stop')]].map((r,i)=>`<rect x="10" y="${8+i*30}" width="22" height="22" rx="6" fill="#1c9b5f"/><path d="M15 ${19+i*30}l5 5 8-10" stroke="#fff" stroke-width="2.5" fill="none"/><text x="42" y="${24+i*30}" font-size="12.5">${r[0]}</text>`).join('')),
];
const STEPS=s=>{const a=/(^|\s)1\.\s/.test(s)?s.split(/\s?\d+\.\s/).filter(x=>x.trim()):s.split(/(?<=\.)\s+(?=\p{Lu})/u);return a.map(x=>x.trim()).filter(Boolean);};
function rHelp(){const q=(S._hq||'').trim();const norm=s=>s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/đ/g,'d');const nq=norm(q);
 const hit=HELP.filter(h=>!nq||norm(h.en.join(' ')+' '+h.vi.join(' ')).includes(nq));
 const mark=s=>{const e=esc(s);if(!nq)return e;const ns=norm(s);let out='',i=0;let k;while((k=ns.indexOf(nq,i))>=0){out+=esc(s.slice(i,k))+'<mark>'+esc(s.slice(k,k+nq.length))+'</mark>';i=k+nq.length;}return out+esc(s.slice(i));};
 const L=LANG==='vi'?'vi':'en',O=L==='vi'?'en':'vi';
 $('#main').innerHTML=`<h1>${t('helpTitle')}</h1><input class="inp" id="helpQ" type="search" placeholder="${t('helpSearch')}" value="${esc(q)}" style="margin:6px 0 14px">
 <div class="row" style="margin-bottom:12px">${TABS.filter(k=>k!=='help').map(k=>`<button class="chip" data-hq="${esc(t(k))}" style="--c:${TABCOL[k]}"><i class="dot" style="background:${TABCOL[k]}"></i>${esc(t(k))}</button>`).join('')}</div>
 ${!nq?`<div class="card" style="--cc:#2457d6;margin-bottom:14px"><h2>${HT('Quick start in 6 steps','Bắt đầu nhanh 6 bước')}</h2>${HPIC[0]()}<p class="sub" style="margin:8px 0 0">${HT('Tap a topic below for pictures and step-by-step help.','Bấm vào từng mục bên dưới để xem hình và hướng dẫn từng bước.')}</p></div>`:''}
 ${hit.length?hit.map(h=>{const hi=HELP.indexOf(h),pic=HPIC[hi],st=STEPS(h[L][1]);return`<details class="acc" ${nq?'open':''} style="border-left:5px solid ${TABCOL[h.tab]}"><summary>${mark(h[L][0])}</summary><div>${pic?`<div style="margin:0 0 12px;border:1px solid var(--line);border-radius:12px;overflow:hidden">${pic()}</div>`:''}<div style="display:grid;gap:8px;margin-bottom:10px">${st.map((x,i)=>`<div style="display:flex;gap:10px;align-items:flex-start;background:var(--bg);border-radius:10px;padding:10px 12px"><b style="flex:none;width:26px;height:26px;border-radius:50%;background:${TABCOL[h.tab]};color:#fff;display:grid;place-items:center;font-size:13px">${i+1}</b><span style="line-height:1.5">${mark(x)}</span></div>`).join('')}</div><details style="margin-top:4px"><summary class="sub" style="cursor:pointer;font-size:13.5px">${L==='vi'?'English':'Tiếng Việt'}</summary><p class="sub" style="margin:6px 0 0;font-size:13.5px">${mark(h[O][0])} — ${mark(h[O][1])}</p></details><button class="btn sm" data-tab="${h.tab}" style="margin-top:10px">${esc(t(h.tab))} →</button></div></details>`;}).join(''):`<p class="sub">${t('noHits')}</p>`}`;
 const qi=$('#helpQ');qi.addEventListener('input',()=>{S._hq=qi.value;const pos=qi.selectionStart;rHelp();const n=$('#helpQ');n.focus();n.setSelectionRange(pos,pos);});}

/* ================= LATHE ================= */
const LTOOLS0=[{num:1,type:'turn',desc:'OD rough CNMG 432 80°',insert:'CNMG',nose:0.031,angle:80},{num:2,type:'turn',desc:'OD finish VNMG 331 35°',insert:'VNMG',nose:0.015,angle:35},
 {num:3,type:'groove',desc:'Groove .125',width:0.125},{num:4,type:'thread',desc:'Thread 60° external',angle:60},{num:5,type:'drill',desc:'Center drill #3',dia:0.25},{num:6,type:'part',desc:'Part-off blade .125',width:0.125},{num:7,type:'bore',desc:'Boring bar .500 min CCMT',insert:'CCMT',nose:0.015,dia:0.5}];
const LOPS0=[{type:'lface',tool:1,on:true},{type:'lrough',tool:1,on:true,doc:0.06,leaveX:0.01},{type:'lfinish',tool:2,on:true},{type:'lgroove',tool:3,on:true,zPos:-0.9,width:0.125,dia:0.9,peckX:0.05},{type:'lthread',tool:4,on:true,pitch:0.05,dia:1.0,zEnd:-0.85,passes:8},{type:'lpart',tool:6,on:true}];
function demoShaft(){return[[0,0.45],[-0.05,0.5],[-0.9,0.5],[-0.9,0.45],[-1.0,0.45],[-1.0,0.625],[-1.8,0.625],[-1.8,0.7],[-2.6,0.7]];}
function L0(){const L=S.lathe={stockD:1.5,faceStock:0.03,src:'demo',ops:LOPS0.map(o=>({...o})),...(S.lathe||{})};if(!S.ltools)S.ltools=LTOOLS0.map(x=>({...x}));
 let P=null;if(L.src==='dxf'&&S.raw)P=C.latheProfileFromGeom(S.raw);if(!P||P.length<2)P=demoShaft();L.prof=P;L.len=-P[P.length-1][0];return L;}
function lFeeds(o){if(!S.ltools)S.ltools=LTOOLS0.map(x=>({...x}));const m=mat(),tl=S.ltools.find(x=>x.num===o.tool)||{};const base=m.sfmC*0.85;const ipr={lface:m.cl*1.0,lrough:m.cl*1.3,lfinish:Math.max(0.003,m.cl*0.5),lgroove:Math.max(0.0015,m.cl*0.3),lthread:o.pitch||0.05,ldrill:Math.max(0.002,m.ipr*0.25),lpart:Math.max(0.0015,m.cl*0.25)}[o.type];
 const res={sfm:Math.round(o.type==='lthread'?base*0.5:o.type==='lpart'||o.type==='lgroove'?base*0.6:base),ipr:+Math.min(0.018,Math.max(0.0015,ipr)).toFixed(4),max:Math.min(mach().rpmMax,3500)};
 const lk={lface:['turn','rough'],lrough:['turn','rough'],lfinish:['turn','finish'],lpart:['part','rough'],lgroove:['part','rough']}[o.type];const Ls=lk&&learnLathe(lk[0],lk[1]);if(Ls){res.sfm=Math.round(Ls.sfm);res.ipr=+Ls.ipr.toFixed(4);res.shop=Ls.n;}return res;}
function latheBuild(){const L=L0();const prog=[];L.ops.forEach((o,i)=>{if(!o.on)return;const tl=S.ltools.find(x=>x.num===o.tool)||{num:o.tool,desc:'?'};const fd=lFeeds(o);const f=o.ipr||fd.ipr;
  const moves=C.genLathe({...o,feed:o.type==='lthread'?o.pitch:f,peckX:o.peckX||0.05},{...L,toolW:tl.width||0.125});prog.push({t:'op',i,name:(i+1)+' '+TX[o.type][0]});
  prog.push({t:'tool',num:tl.num,desc:tl.desc,css:!['ldrill','lthread'].includes(o.type),sfm:o.sfm||fd.sfm,max:fd.max,rpm:Math.round(Math.min(fd.max,(o.sfm||fd.sfm)*3.82/Math.max(0.1,L.stockD)))});prog.push(...moves);});
 L.prog=prog;const mc=mach();L.gcode=C.postLathe(prog,{post:S.post,units:S.units,safeX:L.stockD+1,safeZ:1,name:S.hdr.name||'SHAFT',header:['MINI CAM '+S.hdr.date,'MACHINE '+mc.name,'MATERIAL '+mat().en,'STOCK D'+fl(L.stockD,3)+' X L'+fl(L.len+0.25,3),'Z0 AT FINISHED FACE - X IN DIAMETER']});
 const segs=[];let p=[L.stockD+1,1];let tn=0;for(const b of prog){if(b.t==='tool'){tn=b.num;continue;}if(b.t==='op'){segs.push({op:b.i});continue;}if(b.g===undefined)continue;segs.push({a:p,b:[b.x,b.z],g:b.g,f:b.f||0.01,tn});p=[b.x,b.z];}L.segs=segs.filter(s=>s.a);
 let tsec=0;for(const s of L.segs){const d=Math.hypot((s.b[0]-s.a[0])/2,s.b[1]-s.a[1]);tsec+=s.g===0?d/mc.rapid*60:d/Math.max(0.05,s.f*Math.min(fd0(),mc.rpmMax))*60;}L.time=tsec;return L;}
function fd0(){return 1500;}
function lToolSVG(tl,big){const ins=tl.type==='turn'||tl.type==='bore'?tl.insert||'CNMG':'';const col='#f2c14e',sh='url(#lgS)';let s=`<defs><linearGradient id="lgS" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#b8bfc5"/><stop offset=".5" stop-color="#eef1f3"/><stop offset="1" stop-color="#8d959c"/></linearGradient></defs>`;
 if(tl.type==='turn'){s+=`<rect x="30" y="38" width="70" height="24" rx="2" fill="${sh}" stroke="#6b737a"/>`;const a=(({C:80,D:55,V:35,T:60,W:80})[(tl.insert||'C')[0]]||80)*Math.PI/360,L=22;s+=`<path d="M10 50 L${10+L*Math.cos(a)} ${50-L*Math.sin(a)} L${10+2*L*Math.cos(a)} 50 L${10+L*Math.cos(a)} ${50+L*Math.sin(a)}Z" fill="${col}" stroke="#7a5b12" stroke-width="1.2" transform="rotate(-20 30 50)"/><circle cx="${10+L*Math.cos(a)}" cy="50" r="3" fill="#7a5b12" transform="rotate(-20 30 50)"/>`;}
 else if(tl.type==='bore'){s+=`<rect x="22" y="44" width="78" height="12" rx="6" fill="${sh}" stroke="#6b737a"/><path d="M8 50l10-8 6 8-6 8z" fill="${col}" stroke="#7a5b12"/>`;}
 else if(tl.type==='groove'||tl.type==='part'){s+=`<rect x="40" y="30" width="60" height="22" rx="2" fill="${sh}" stroke="#6b737a"/><rect x="26" y="${tl.type==='part'?40:44}" width="${tl.type==='part'?60:20}" height="${Math.max(4,(tl.width||0.125)*48)}" fill="#c7ccd1" stroke="#6b737a"/><rect x="18" y="${tl.type==='part'?40:44}" width="9" height="${Math.max(4,(tl.width||0.125)*48)}" fill="${col}" stroke="#7a5b12"/>`;}
 else if(tl.type==='thread'){s+=`<rect x="30" y="38" width="70" height="24" rx="2" fill="${sh}" stroke="#6b737a"/><path d="M8 50l18-11v22z" fill="${col}" stroke="#7a5b12"/><path d="M8 50l7-4v8z" fill="#7a5b12"/>`;}
 else if(tl.type==='drill'){s+=`<rect x="34" y="42" width="66" height="16" rx="2" fill="${sh}" stroke="#6b737a"/><path d="M34 42v16L14 52v-4z" fill="#d7dbdf" stroke="#6b737a"/><path d="M14 48l-6 2 6 2z" fill="#6b737a"/>`;}
 s+=`<text x="100" y="${big?86:84}" text-anchor="end" font-size="${big?9:10}" font-weight="700" fill="#555">${esc(ins||tl.type.toUpperCase())}</text>`;
 return`<svg viewBox="0 0 110 90" style="width:100%;height:100%" font-family="Barlow,system-ui,sans-serif">${s}</svg>`;}
let LSIM=null;
function latheDraw(cv,upto){const L=S.lathe;if(!cv||!L)return;const dpr=Math.min(2,devicePixelRatio||1),W=cv.clientWidth,H=cv.clientHeight;cv.width=W*dpr;cv.height=H*dpr;const g=cv.getContext('2d');g.setTransform(dpr,0,0,dpr,0,0);g.clearRect(0,0,W,H);
 const R0=L.stockD/2,len=L.len+0.4,sc=Math.min((W-40)/(len+0.6),(H-40)/(R0*2.6)),ox=W-30-0.3*sc,oy=H/2;const X=z=>ox+z*sc,Y=r=>oy-r*sc;
 // chuck
 g.fillStyle='#5b6168';g.fillRect(X(-len-0.2)-30,Y(R0*1.3),30,R0*2.6*sc);
 // stock (with removal grid if sim)
 const grid=LSIM&&LSIM.r;g.fillStyle='#c9ced3';
 if(grid){for(let i=0;i<grid.length;i++){const z=-len+i*LSIM.dz;const r=grid[i];g.fillRect(X(z),Y(r),LSIM.dz*sc+0.6,r*2*sc);}}else{g.fillRect(X(-len),Y(R0),(len+L.faceStock)*sc,R0*2*sc);}
 // part profile
 g.beginPath();L.prof.forEach((p,i)=>{i?g.lineTo(X(p[0]),Y(p[1])):g.moveTo(X(p[0]),Y(p[1]));});for(let i=L.prof.length-1;i>=0;i--){const p=L.prof[i];g.lineTo(X(p[0]),Y(-p[1]));}g.closePath();g.fillStyle='rgba(36,87,214,.28)';g.fill();g.strokeStyle='#2457d6';g.lineWidth=2;g.stroke();
 g.setLineDash([8,4,2,4]);g.strokeStyle='#888';g.lineWidth=1;g.beginPath();g.moveTo(X(-len-0.3),oy);g.lineTo(X(0.4),oy);g.stroke();g.setLineDash([]);
 // toolpaths
 const segs=L.segs||[];const n=upto==null?segs.length:upto;g.lineWidth=1.2;for(let k=0;k<n;k++){const s=segs[k];g.strokeStyle=s.g===0?'rgba(217,58,58,.5)':OPCOL[(s.tn-1)%OPCOL.length];g.setLineDash(s.g===0?[3,3]:[]);g.beginPath();g.moveTo(X(s.a[1]),Y(s.a[0]/2));g.lineTo(X(s.b[1]),Y(s.b[0]/2));g.stroke();}g.setLineDash([]);
 if(upto!=null&&segs[Math.max(0,n-1)]){const s=segs[Math.max(0,n-1)],tx=X(s.b[1]),ty=Y(s.b[0]/2);g.fillStyle='#f2c14e';g.strokeStyle='#7a5b12';g.beginPath();g.moveTo(tx,ty);g.lineTo(tx+14,ty-22);g.lineTo(tx+26,ty-10);g.closePath();g.fill();g.stroke();g.fillStyle='#9aa1a7';g.fillRect(tx+18,ty-40,40,18);}
 g.fillStyle='#d93a3a';g.font='700 12px Barlow';g.fillText('Z0',X(0)-8,Y(R0)-8);}
function rLathe(){const L=latheBuild();const tl=n=>S.ltools.find(x=>x.num===n);
 $('#main').innerHTML=`<h1>${t('latheTitle')}</h1><p class="sub">${t('latheSub')}</p><div class="grid g2"><div class="grid" style="align-content:start">
  <div class="view" style="height:min(46vh,420px)"><canvas id="lcv"></canvas><div class="ovl bl"><span class="pill">Ø${fl(L.stockD,3)} × ${fl(L.len,3)} ${ulab()} · ${Math.round(L.time/60*10)/10} min</span></div></div>
  <div class="card"><h2>${t('gcode')}</h2><div class="row" style="margin-bottom:10px"><button class="btn go" data-act="lSave">${IC.save}${t('saveFile')}</button><button class="btn" data-act="lCopy">${IC.copy}${t('copy')}</button>
   <label class="chip">${t('post')} <select id="postSel"><option value="haas" ${S.post==='haas'?'selected':''}>Haas lathe</option><option value="fanuc" ${S.post==='fanuc'?'selected':''}>Fanuc lathe</option><option value="siemens" ${S.post==='siemens'?'selected':''}>Siemens 840D</option></select></label></div><pre class="code">${hlG(L.gcode)}</pre></div></div>
 <div class="grid" style="align-content:start"><div class="card"><h2>${t('stock')}</h2><div class="fields">${inp('stockD',fl(L.stockD),'data-lb="stockD" data-u="L"')}${inp('faceStock',fl(L.faceStock),'data-lb="faceStock" data-u="L"')}</div>
  <div class="row" style="margin-top:10px"><div class="seg"><button data-lsrc="demo" class="${L.src!=='dxf'?'on':''}">${t('demoShaft')}</button><button data-lsrc="dxf" class="${L.src==='dxf'?'on':''}">${t('useDxf')}</button></div><button class="btn sm" data-act="import">${IC.file}${t('importAny')}</button></div></div>
  <div class="card"><h2>${t('ops')}</h2><div class="ops">${L.ops.map((o,i)=>{const fd=lFeeds(o),T=tl(o.tool)||{};const F=(k,p,u)=>inp(k,u==='L'?fl(o[p]??''):o[p]??'',`data-lo="${i}" data-k="${p}" data-u="${u||'L'}"`);
   return`<div class="op ${o.on?'':'off'} open"><div class="oph"><span class="opi" style="background:${OPCOL[i%OPCOL.length]};padding:2px">${lToolSVG(T)}<em>${i+1}</em></span><span class="opt"><b>${esc(t(o.type))}</b><span>T${o.tool} ${esc(T.desc||'')} · <b>${fd.sfm} SFM · ${fd.ipr} ipr${fd.shop?' · '+(LANG==='vi'?'Dữ liệu xưởng ×':'Shop data ×')+fd.shop:''}</b></span></span><label class="sw"><input type="checkbox" data-lon="${i}" ${o.on?'checked':''}><i></i></label></div>
   <div class="opb"><div class="fields"><label class="f">${t('tool')}<select data-lo="${i}" data-k="tool" data-u="N">${S.ltools.map(x=>`<option value="${x.num}" ${x.num===o.tool?'selected':''}>T${x.num} ${esc(x.desc)}</option>`).join('')}</select></label>
    ${o.type==='lrough'?F('doc','doc')+F('leaveX','leaveX'):''}${o.type==='lgroove'?F('zPos','zPos')+F('width','width')+F('dia','dia')+F('peckX','peckX'):''}${o.type==='lthread'?F('pitchL','pitch')+F('dia','dia')+F('zEnd','zEnd')+F('passes2','passes','N'):''}${o.type==='ldrill'?F('depthL','depth')+F('peckX','peck'):''}</div></div></div>`;}).join('')}
   <div class="row" style="margin-top:10px"><select class="inp" id="lAddSel" style="flex:1">${['lface','lrough','lfinish','lgroove','lthread','ldrill','lpart'].map(k=>`<option value="${k}">${t(k)}</option>`).join('')}</select><button class="btn sm" data-act="lAdd">${IC.plus}</button></div></div></div></div></div>`;
 const cv=$('#lcv');new ResizeObserver(()=>latheDraw(cv)).observe(cv);}
function rLatheSim(){const L=latheBuild();$('#main').innerHTML=`<h1>${t('simTitle')} · ${t('lathe')}</h1><div class="view" id="sv" style="height:min(55vh,520px)"><canvas id="lcv"></canvas><div class="ovl bl"><span class="pill" id="lInfo"></span></div></div>
 <div class="card" style="margin-top:12px"><div class="row"><button class="btn go" id="lPlay">${IC.play}${t('play')}</button><button class="btn" data-act="lReset">${IC.reset}${t('reset')}</button><label class="f" style="flex:1;min-width:160px">${t('speed')}<input type="range" id="lSpeed" min="1" max="60" value="12"></label></div></div>`;
 const cv=$('#lcv');const R0=L.stockD/2,len=L.len+0.4,dz=len/400;LSIM={r:new Float32Array(Math.ceil((len+L.faceStock)/dz)+1).fill(R0),dz,k:0,playing:false};
 const cut=(x,z)=>{const r=x/2;const i=Math.round((z+len)/dz);for(let d=-1;d<=1;d++){const ii=i+d;if(ii>=0&&ii<LSIM.r.length&&r<LSIM.r[ii])LSIM.r[ii]=Math.max(0,r);}};
 const step=n=>{for(let q=0;q<n&&LSIM.k<L.segs.length;q++){const s=L.segs[LSIM.k++];if(s.g!==0){const m=Math.max(1,Math.ceil(Math.hypot(s.b[0]-s.a[0],s.b[1]-s.a[1])/dz));for(let j=0;j<=m;j++)cut(s.a[0]+(s.b[0]-s.a[0])*j/m,s.a[1]+(s.b[1]-s.a[1])*j/m);}}
  latheDraw(cv,LSIM.k);const s=L.segs[Math.max(0,LSIM.k-1)];$('#lInfo').textContent=s?`T${s.tn} · X${fl(s.b[0],3)} Z${fl(s.b[1],3)} · ${Math.round(LSIM.k/L.segs.length*100)}%`:'';};
 LSIM.step=step;const loop=()=>{if(!LSIM.playing)return;step(+$('#lSpeed').value);if(LSIM.k>=L.segs.length){LSIM.playing=false;$('#lPlay').innerHTML=IC.play+t('play');return;}requestAnimationFrame(loop);};LSIM.loop=loop;
 new ResizeObserver(()=>latheDraw(cv,LSIM.k)).observe(cv);}

/* ================= NEST (many parts on one sheet) ================= */
const NEST0={mode:'flat',w:24,h:12,sheetT:0.5,partT:0.5,margin:0.5,tabW:0.25,tabT:0.03,tabEvery:5,tabFixed:0,hold:'screw',removal:'break',tool:'',items:[{src:'current',qty:0},{src:'L',qty:2},{src:'rib',qty:2},{src:'plate',qty:0}]};
let NESTR=null,NESTG='';
function demoPart(src){const R=(x0,y0,x1,y1)=>[[x0,y0],[x1,y0],[x1,y1],[x0,y1]];
 if(src==='L')return{name:'L-bracket',loops:[[[0,0],[4,0],[4,1],[1,1],[1,3],[0,3]]],circles:[{x:0.5,y:0.5,r:0.1005},{x:3.5,y:0.5,r:0.1005},{x:0.5,y:2.5,r:0.1005}]};
 if(src==='rib')return{name:'Rib',loops:[R(0,0,10,1)],circles:[{x:0.5,y:0.5,r:0.1328},{x:9.5,y:0.5,r:0.1328}]};
 if(src==='plate')return{name:'Plate',loops:[R(0,0,3,2)],circles:[{x:1.5,y:1,r:0.375},{x:0.4,y:0.4,r:0.1005},{x:2.6,y:0.4,r:0.1005},{x:0.4,y:1.6,r:0.1005},{x:2.6,y:1.6,r:0.1005}]};
 if(src==='current'&&S.geom){const b=C.geomBox(S.geom);const g=C.scaleGeom(S.geom,1,-b[0],-b[1]);const ex=new Set(S.excl||[]);return{name:S.hdr.name||'Part',loops:g.loops,circles:g.circles,ld:g.ld};}
 return null;}
function nestCompute(){
 const N=S.nest={...NEST0,...(S.nest||{})};const tl=toolById(N.tool)||findTool(x=>x.type==='flat'&&x.dia<=0.25)||findTool(x=>x.type==='flat');N.tool=tl?tl.id:'';const D=tl?tl.dia:0.25,gap=D+0.125;
 const types=[];N.items.forEach((it,ti)=>{const p=demoPart(it.src);if(!p||!p.loops.length)return;const outer=p.loops.reduce((a,b)=>Math.abs(C.area(b))>Math.abs(C.area(a))?b:a);const b=C.bbox(outer);types.push({...p,ti,qty:+it.qty||0,outer,w:b[2]-b[0],h:b[3]-b[1],bx:b[0],by:b[1],area:(b[2]-b[0])*(b[3]-b[1])});});
 types.sort((a,b)=>b.area-a.area);const placed=[],W=N.w-N.margin,H=N.h-N.margin,warn=[];
 const fits=(x,y,w,h)=>x>=N.margin-1e-9&&y>=N.margin-1e-9&&x+w<=W+1e-9&&y+h<=H+1e-9&&!placed.some(p=>x<p.x+p.w+gap-1e-9&&x+w+gap>p.x+1e-9&&y<p.y+p.h+gap-1e-9&&y+h+gap>p.y+1e-9);
 const tryPlace=T=>{let best=null;const cands=[[N.margin,N.margin]];placed.forEach(p=>{cands.push([p.x+p.w+gap,p.y],[p.x,p.y+p.h+gap],[N.margin,p.y+p.h+gap],[p.x+p.w+gap,N.margin]);});
  for(const rot of[0,90,180,270]){const w=rot%180?T.h:T.w,h=rot%180?T.w:T.h;for(const c of cands){if(fits(c[0],c[1],w,h)){if(!best||c[1]<best.y-1e-9||(Math.abs(c[1]-best.y)<1e-9&&c[0]<best.x))best={x:c[0],y:c[1],w,h,rot,T};}}}
  if(best){placed.push(best);return true;}return false;};
 for(const T of types){if(T.qty>0){let n=0;for(let i=0;i<T.qty;i++)if(tryPlace(T))n++;if(n<T.qty)warn.push(`${T.name}: ${n}/${T.qty} ${t('placed')} — ${LANG==='vi'?'không vừa tấm':'does not fit the sheet'}`);}}
 let guard=0,any=true;while(any&&guard++<300){any=false;for(const T of types)if(T.qty===0&&tryPlace(T))any=true;}
 // transform geometry
 const xf=(p,q)=>{let x=q[0]-p.T.bx,y=q[1]-p.T.by;const w=p.T.w,h=p.T.h;if(p.rot===90){[x,y]=[h-y,x];}else if(p.rot===180){[x,y]=[w-x,h-y];}else if(p.rot===270){[x,y]=[y,w-x];}return[x+p.x,y+p.y];};
 placed.forEach((p,k)=>{p.id=k;p.loops=p.T.loops.map(l=>l.map(q=>xf(p,q)));p.circles=p.T.circles.map(c=>{const q=xf(p,[c.x,c.y]);return{x:q[0],y:q[1],r:c.r};});p.outer=p.T.outer.map(q=>xf(p,q));if(C.area(p.outer)<0)p.outer.reverse();
  // tabs on straight edges, away from corners
  const per=C.perim(p.outer,true),n=N.tabFixed>0?Math.round(N.tabFixed):Math.max(2,Math.ceil(per/N.tabEvery)),need=N.tabW+D+0.05;const segs=[];let acc=0;
  for(let i=0;i<p.outer.length;i++){const a=p.outer[i],b=p.outer[(i+1)%p.outer.length],L=C.dist(a,b);segs.push({a,b,L,s:acc});acc+=L;}
  const ok=segs.filter(s=>s.L>=need);const tabs=[];
  for(let k2=0;k2<n&&ok.length;k2++){const target=(k2+0.5)*per/n;let bs=null,bd=1e18;for(const s of ok){const lo=s.s+need/2,hi=s.s+s.L-need/2;const tt=Math.min(hi,Math.max(lo,target));const d=Math.abs(tt-target);if(d<bd&&!tabs.some(q=>Math.abs(q.s-tt)<need*1.5)){bd=d;bs={s:tt,seg:s};}}
   if(bs){const u=(bs.s-bs.seg.s)/bs.seg.L;tabs.push({s:bs.s,x:bs.seg.a[0]+(bs.seg.b[0]-bs.seg.a[0])*u,y:bs.seg.a[1]+(bs.seg.b[1]-bs.seg.a[1])*u});}}
  p.tabs=tabs;p.per=per;
  if(tabs.length<n)warn.push(`${p.T.name} #${k+1}: ${tabs.length}/${n} ${t('tabsN')} (${LANG==='vi'?'thiếu cạnh thẳng':'not enough straight edges'})`);
  if(Math.max(p.w,p.h)>8&&tabs.length<3)warn.push(`${p.T.name} #${k+1}: ${LANG==='vi'?'chi tiết dài chỉ có':'long part has only'} ${tabs.length} ${t('tabsN')}`);});
 // screw holes in the skeleton
 const holes=[];if(N.hold==='screw'){const inset=Math.max(0.3,N.margin*0.6),clr=0.3+gap/2;const cand=[];const nx=Math.max(2,Math.round(N.w/6)+1),ny=Math.max(2,Math.round(N.h/6)+1);
  for(let i=0;i<nx;i++){const x=inset+(N.w-2*inset)*i/(nx-1);cand.push([x,inset],[x,N.h-inset]);}for(let j=1;j<ny-1;j++){const y=inset+(N.h-2*inset)*j/(ny-1);cand.push([inset,y],[N.w-inset,y]);}
  for(const c of cand)if(!placed.some(p=>c[0]>p.x-clr&&c[0]<p.x+p.w+clr&&c[1]>p.y-clr&&c[1]<p.y+p.h+clr))holes.push(c);
  // also gaps between parts
 }
 if(N.tabT<0.04&&N.hold==='vacuum')warn.push(LANG==='vi'?'Tab mỏng hơn .040" trên bàn hút: chi tiết dễ bị xê dịch.':'Tabs thinner than .040" on a vacuum table: parts may shift.');
 if(N.tabT<0.04&&N.mode==='twoSide')warn.push(LANG==='vi'?'Tab mỏng hơn .040" cho chi tiết 3D hai mặt.':'Tabs thinner than .040" for a two-sided 3D part.');
 if(N.tabW<D)warn.push(LANG==='vi'?`Tab rộng ${fl(N.tabW,3)} hẹp hơn Ø dao ${fl(D,3)}.`:`Tab ${fl(N.tabW,3)} is narrower than the cutter Ø${fl(D,3)}.`);
 if(N.removal==='break'&&N.tabT>0.06)warn.push(LANG==='vi'?'Tab dày hơn .060" khó bẻ bằng tay — chọn phay trên đồ gá.':'Tabs thicker than .060" are hard to break by hand — mill them instead.');
 if(N.sheetT<N.partT)warn.push(LANG==='vi'?'Tấm mỏng hơn chi tiết.':'Sheet is thinner than the part.');
 NESTR={placed,holes,warn,D,gap,tool:tl};return NESTR;}
function nestProgram(){
 const N=S.nest,R=NESTR||nestCompute();if(!R.placed.length||!R.tool)return'';const tl=R.tool,m=mat(),mc=mach();const prog=[];let last=null,first=true,pos=null;const sr=[0,0,N.w,N.h];
 const ctxB=(tool,feat)=>({tool,feat,stockRect:sr,clear:1,retract:0.1,tol:0.0003,pos});
 const run=(tool,op,feat,name)=>{const o={...newOp(op.type,null,tool.id,op),...op};const r=C.genOp(o,ctxB(tool,feat));if(!r.moves.length)return;prog.push({t:'op',i:-1,name});
  if(last!==tool.id){prog.push({t:'tool',tool:{num:tool.num,desc:tool.desc+' D'+(+tool.dia.toFixed(4))},idx:S.tools.indexOf(tool)});prog.push({t:'spin',s:o.rpm,first});const fm=r.moves.find(q=>q.x!==undefined)||{x:0,y:0};prog.push({t:'g43',x:fm.x,y:fm.y,h:tool.num});first=false;last=tool.id;}
  prog.push(...r.moves);pos=r.end;};
 const thick=N.partT,top=0;
 // 1 screw holes
 if(N.hold==='screw'&&R.holes.length){const dr=ensureTool({type:'drill',desc:'17/64 drill (1/4-20 clearance)',dia:0.2656,flutes:2,mat:'hss',coat:'black',tipAngle:118,loc:Math.max(1,N.sheetT+0.5),oal:4});
  run(dr,{type:'drill',zTop:N.sheetT-thick,zBot:-thick-0.3*0.2656-0.05,cycle:'G83',peck:0.1},{kind:'holes',dia:0.2656,pts:R.holes},'1 SCREW HOLES 1/4-20');}
 // 2 face
 if(N.sheetT>thick+0.0005){const fm=findTool(x=>x.type==='face')||tl;run(fm,{type:'face',zTop:N.sheetT-thick,zBot:0},{kind:'none'},'2 FACE SHEET');}
 // 3 part holes by diameter
 const byD={};R.placed.forEach(p=>p.circles.forEach(c=>{const k=(2*c.r).toFixed(4);(byD[k]=byD[k]||[]).push([c.x,c.y]);}));
 const spot=findTool(x=>x.type==='spot');
 Object.keys(byD).sort().forEach(k=>{const d=+k;if(d>0.5)return;if(spot)run(spot,{type:'spot',zBot:-Math.min(d/2+0.01,spot.dia*0.45),cycle:'G82',dwell:0.2},{kind:'holes',dia:d,pts:byD[k]},'3 SPOT D'+k);});
 Object.keys(byD).sort().forEach(k=>{const d=+k;if(d>0.5){const em=findTool(x=>x.type==='flat'&&x.dia<=d*0.7)||tl;run(em,{type:'circ',zBot:-(thick+0.02)},{kind:'holes',dia:d,pts:byD[k]},'3 HELICAL BORE D'+k);return;}
  const tap=C.TAPS.find(x=>Math.abs(x[3]-d)<0.003);const dr=ensureTool({type:'drill',desc:(tap?tap[4]+' ':'')+'Ø'+d.toFixed(4)+' drill',dia:d,flutes:2,mat:'hss',coat:'black',tipAngle:118,loc:thick+0.5,oal:thick+2});
  run(dr,{type:'drill',zBot:-(thick+0.3*d+0.03),cycle:thick>3*d?'G83':'G81',peck:d},{kind:'holes',dia:d,pts:byD[k]},'3 DRILL D'+k);
  if(tap){const tp=ensureTool({type:'tap',desc:tap[0]+' spiral point tap',dia:tap[1],flutes:3,mat:'hss',coat:'none',pitch:tap[2],loc:1,oal:2.5});run(tp,{type:'tap',zBot:-(thick+0.05)},{kind:'holes',dia:d,pts:byD[k]},'3 TAP '+tap[0]);}});
 // 4 pockets + 5 contour with tabs
 R.placed.forEach((p,k)=>{const feats=C.classify({loops:p.loops,circles:[],opens:[]});feats.filter(f=>f.kind==='pocket').forEach(f=>run(tl,{type:'adaptive',zBot:-Math.min(0.25,thick),leave:0},f,'4 POCKET '+p.T.name+' '+(k+1)));});
 const tz=-(thick)+N.tabT;
 R.placed.forEach((p,k)=>{run(tl,{type:'contour',zBot:-(thick+0.02),leave:0,lead:'arc',tabs:{pts:p.tabs.map(q=>[q.x,q.y]),w:N.tabW,z:tz}},{kind:'profile',loop:p.outer},'5 CONTOUR+TABS '+p.T.name+' '+(k+1));});
 prog.push({t:'op',i:-1,name:'6 MEASURE PARTS ON MACHINE (M00)'});
 const k_=K(),scale=b=>{if(b.t==='cycle')return{...b,pts:b.pts.map(p=>[p[0]*k_,p[1]*k_]),z:b.z*k_,r:b.r*k_,q:b.q*k_,f:b.f*k_,clear:b.clear*k_};if(b.t==='g43')return{...b,x:b.x*k_,y:b.y*k_};if(b.g!==undefined){const o={...b,x:b.x*k_,y:b.y*k_,z:b.z*k_};if(b.f&&!b.inv)o.f=b.f*k_;if(b.g>1){o.i=b.i*k_;o.j=b.j*k_;}return o;}return b;};
 const g=(S.post==='siemens'?C.postSiemens:C.post)(prog.map(scale),{units:S.units,clear:k_,post:S.post,name:(S.hdr.name||'NEST')+' NEST',progNo:2001,coolant:true,lineNums:S.lineNums,toolStop:S.toolStop,
  header:['MINI CAM NEST '+S.hdr.date,'MACHINE '+mc.name,'MATERIAL '+m.en,'SHEET '+fl(N.w,3)+' X '+fl(N.h,3)+' X '+fl(N.sheetT,3),'X0 Y0 LOWER LEFT OF SHEET - Z0 TOP OF FINISHED PART',(N.hold==='screw'?'SCREW SHEET TO SUBPLATE AFTER OP 1':'VACUUM HOLD'),'TABS '+fl(N.tabW,3)+' W X '+fl(N.tabT,3)+' T']});
 const segs=C.simSegs(prog,1);R.time=C.cycleTime(segs,mc.rapid,prog.filter(b=>b.t==='tool').length,S.toolStop?60:30);R.prog=prog;return g;}
function nestSVG(){
 const N=S.nest,R=NESTR;const pad=0.6,W=N.w+2*pad,H=N.h+2*pad;const sw=W/500;const P=l=>l.map((q,i)=>(i?'L':'M')+q[0].toFixed(3)+' '+(-q[1]).toFixed(3)).join('')+'Z';
 const cols=['#2457d6','#8b4fd6','#1c9b5f','#e0457b','#0a9bb0','#c48a00'];
 let s=`<rect x="0" y="${-N.h}" width="${N.w}" height="${N.h}" rx="${sw*4}" fill="#dfe4e9" stroke="#8d969e" stroke-width="${sw*1.5}"/><rect x="${N.margin}" y="${-N.h+N.margin}" width="${N.w-2*N.margin}" height="${N.h-2*N.margin}" fill="none" stroke="#8d969e" stroke-dasharray="${sw*5} ${sw*4}" stroke-width="${sw}"/>`;
 R.placed.forEach((p,k)=>{const c=cols[p.T.ti%cols.length];s+=`<path d="${p.loops.map(P).join('')}" fill="${c}" fill-opacity=".22" fill-rule="evenodd" stroke="${c}" stroke-width="${sw*1.6}"/>`;
  p.circles.forEach(q=>s+=`<circle cx="${q.x}" cy="${-q.y}" r="${q.r}" fill="#fff" stroke="${c}" stroke-width="${sw*1.2}"/>`);
  p.tabs.forEach(q=>s+=`<rect x="${q.x-N.tabW/2-R.D/2}" y="${-q.y-R.D/2}" width="${N.tabW+R.D}" height="${R.D}" rx="${sw*2}" fill="#ff6a13" stroke="#b54200" stroke-width="${sw*0.8}"/>`);
  s+=`<text x="${p.x+p.w/2}" y="${-(p.y+p.h/2)}" font-size="${Math.min(0.45,Math.min(p.w,p.h)*0.3)}" text-anchor="middle" dominant-baseline="middle" fill="#14181c" font-weight="700">${k+1}</text>`;});
 R.holes.forEach(q=>s+=`<circle cx="${q[0]}" cy="${-q[1]}" r="0.17" fill="#1c9b5f" stroke="#0d5c37" stroke-width="${sw}"/>`);
 return`<svg viewBox="${-pad} ${-N.h-pad} ${W} ${H}" style="width:100%;height:auto" font-family="Barlow,system-ui,sans-serif">${s}</svg>`;}
function tabSectionSVG(){const N=S.nest,R=NESTR;const T=N.partT,tt=N.tabT,w=N.tabW,D=R.D;
 const zone=w+D,W=Math.max(zone*3,1.6),sc=300/W,Hh=Math.max(T*sc+90,140);const X=v=>10+v*sc,Y=v=>40+v*sc;const cx=W/2;
 let s=`<rect x="${X(0)}" y="${Y(0)}" width="${W*sc}" height="${T*sc}" fill="#eef1f4" stroke="#9aa3ab" stroke-dasharray="4 3"/>`;
 s+=`<rect x="${X(cx-w/2)}" y="${Y(T-tt)}" width="${w*sc}" height="${tt*sc}" fill="#ff6a13"/>`;
 const zb=T+0.02,zt=T-tt;s+=`<path d="M${X(0)} ${Y(zb)}H${X(cx-zone/2)}L${X(cx-zone/2+0.02)} ${Y(zt)}H${X(cx+zone/2-0.02)}L${X(cx+zone/2)} ${Y(zb)}H${X(W)}" fill="none" stroke="#2457d6" stroke-width="2.4" stroke-dasharray="7 4"/>`;
 s+=`<rect x="${X(cx-D/2)}" y="${Y(zt)-T*sc*1.1}" width="${D*sc}" height="${T*sc*1.1}" rx="3" fill="#8f979e" opacity=".55"/>`;
 s+=`<text x="${X(cx)}" y="${Y(T-tt)-T*sc*1.1-8}" font-size="12" text-anchor="middle" fill="#b54200" font-weight="700">TAB ${fl(w,3)} × ${fl(tt,3)}</text>`;
 s+=`<text x="${X(0)}" y="${Y(zb)+22}" font-size="11.5" fill="#2457d6" font-weight="600">${LANG==='vi'?'Tâm dao nhấc lên qua tab (vùng = rộng tab + Ø dao)':'Tool centre lifts over the tab (zone = tab width + tool Ø)'}</text>`;
 return`<svg viewBox="0 0 ${W*sc+20} ${Hh}" style="width:100%;height:auto;max-height:240px;background:#fff;border-radius:10px" font-family="Barlow,system-ui,sans-serif">${s}</svg>`;}
function tabCheckRows(){const N=S.nest,R=NESTR;const tl=R.tool;if(!tl)return'';const minTabs=Math.max(1,Math.min(...R.placed.map(p=>p.tabs.length||1)));
 const mats=[{n:'6061-T6',tau:30000,sy:40000,kc:100000,id:'al6061'},{n:'4130',tau:58000,sy:63000,kc:290000,id:'s4140'}];
 return mats.map(M=>{const mm=C.MATERIALS.find(x=>x.id===M.id);const f=C.feeds(tl,mm,'finish',{machine:mach()});const doc=Math.min(N.partT,(tl.loc||1)*0.9),fz=Math.max(f.fz,0.0005);
  const Ft=M.kc*doc*fz;const Vs=M.tau*N.tabW*N.tabT*minTabs;const Mb=M.sy*N.tabW*N.tabT*N.tabT/6;const Fb=Mb/Math.max(R.D,0.05)*minTabs;
  const dr=0.25,Th=0.5*M.kc*(dr/2)*0.004;const sf1=Vs/Ft,sf2=Fb/Math.max(Th,1);
  const c=v=>`<b style="color:${v<2?'var(--bad)':'var(--ok)'}">${v.toFixed(1)}</b>`;
  return`<tr><td>${M.n}</td><td class="n">${Math.round(Ft)} lbf</td><td class="n">${Math.round(Vs)} lbf</td><td class="n">${c(sf1)}</td><td class="n">${Math.round(Fb)} lbf</td><td class="n">${c(sf2)}</td></tr>`;}).join('');}
function rNest(){
 S.nest={...NEST0,...(S.nest||{})};const N=S.nest;nestCompute();NESTG=nestProgram();const R=NESTR;
 const L=(k,p)=>inp(k,fl(N[p]),`data-nb="${p}" data-u="L"`),Nn=(k,p)=>inp(k,N[p],`data-nb="${p}" data-u="N"`);
 const srcs=[['current',t('curPart')],['L','L-bracket'],['rib','Rib 10 × 1'],['plate','Plate 3 × 2']];
 const totTabs=R.placed.reduce((a,p)=>a+p.tabs.length,0);const lines=NESTG.split('\n');const ti=lines.findIndex(l=>new RegExp('Z'+(fl(-N.partT+N.tabT,4)).replace('.','\\.')+'\\b').test(l));
 $('#main').innerHTML=`<h1>${t('nestTitle')}</h1><p class="sub">${t('nestSub')}</p>
 <div class="grid g2"><div class="grid" style="align-content:start">
  <div class="card"><h2>${t('nest')} · ${fl(N.w,2)} × ${fl(N.h,2)}</h2>${nestSVG()}
   <div class="kpi" style="margin-top:10px"><div><span>${t('parts')}</span><b>${R.placed.length}</b></div><div><span>${t('tabsN')}</span><b>${totTabs}</b></div><div><span>${t('screws')}</span><b>${R.holes.length}</b></div><div><span>${t('cycle')}</span><b>${R.time?(R.time/60).toFixed(1)+' min':'—'}</b></div></div>
   <div class="legend"><span><i class="dot" style="background:#ff6a13"></i>Tab</span><span><i class="dot" style="background:#1c9b5f"></i>${LANG==='vi'?'Lỗ vít':'Screw hole'}</span></div>
   ${R.warn.length?`<div class="warn" style="margin-top:10px">${R.warn.map(esc).join('<br>')}</div>`:''}
   <p class="sub" style="margin:8px 0 0;font-size:13px">${t('bboxNote')} ${t('sampleNote')}</p></div>
  <div class="card"><h2>${t('order')}</h2><ol style="margin:0;padding-left:20px;line-height:1.7">
   ${N.hold==='screw'?`<li>${LANG==='vi'?'Khoan lỗ bắt vít 1/4-20 trên khung tấm, rồi bắt vít xuống subplate':'Drill 1/4-20 screw holes in the skeleton, then screw the sheet to the subplate'}</li>`:''}
   ${N.sheetT>N.partT?`<li>${LANG==='vi'?'Phay mặt tấm xuống đúng chiều dày':'Face the sheet to thickness'}</li>`:''}
   <li>${LANG==='vi'?'Khoan / doa / taro lỗ chi tiết':'Drill / ream / tap part holes'}</li><li>${LANG==='vi'?'Phay hốc':'Pockets'}</li><li>${LANG==='vi'?'Contour chừa tab':'Contour with tabs'}</li><li>${LANG==='vi'?'Đo trên máy (M00)':'Measure on the machine (M00)'}</li>
   <li>${N.removal==='break'?(LANG==='vi'?'Bẻ tab và giũa chân tab':'Break tabs and file the stubs'):(LANG==='vi'?'Setup 2: bắt từng chi tiết lên tấm gá qua lỗ của nó, phay phẳng chân tab':'Setup 2: bolt each part to a fixture plate through its holes, mill the tab stubs flush')}</li></ol>
   ${N.mode==='twoSide'?`<div class="warn" style="margin-top:10px">${LANG==='vi'?'3D hai mặt: Setup 1 phá thô + tinh 3D mặt trên, đường quanh chi tiết xuống quá đường phân khuôn ~.050", nhấc dao qua tab (.250 × .060). Setup 2: lật, kẹp khung phôi, phay 3D mặt dưới đến gặp setup 1. Phần G-code 3D hai mặt dùng nguyên công 3D ở tab Chương trình (cần STL).':'3D two-sided: Setup 1 roughs + finishes the top, the cut around the part goes ~.050" past the parting line and lifts over tabs (.250 × .060). Setup 2: flip, clamp the frame, machine the underside to meet Setup 1. Use the 3D operations in the Program tab (needs an STL) for that G-code.'}</div>`:''}</div>
  <div class="card"><h2>${t('tabSection')}</h2>${tabSectionSVG()}<pre class="code" style="margin-top:10px;max-height:200px">${ti>0?hlG(lines.slice(Math.max(0,ti-3),ti+5).join('\n')):'—'}</pre></div>
  <div class="card"><h2>${t('tabCheck')}</h2><div class="scroll"><table><thead><tr><th>${t('material')}</th><th class="n">${LANG==='vi'?'Lực phay':'Mill force'}</th><th class="n">${LANG==='vi'?'Tab chịu cắt':'Tab shear'}</th><th class="n">SF</th><th class="n">${LANG==='vi'?'Tab chịu uốn':'Tab bending'}</th><th class="n">SF ${LANG==='vi'?'lực đẩy (setup 2)':'thrust (setup 2)'}</th></tr></thead><tbody>${tabCheckRows()}</tbody></table></div>
   <p class="sub" style="margin:8px 0 0;font-size:13px">${LANG==='vi'?'Ước lượng theo lực cắt riêng của vật liệu, chưa tính rung hay dao mòn — vì vậy cần hệ số an toàn ≥ 2. Tab bẻ tay (.030–.060) chỉ dùng khi lực nằm trong mặt phẳng tab. Cột lực đẩy là khi phải gia công tiếp lúc chi tiết chỉ còn dính bằng tab (setup 2): nếu SF < 2 thì làm tab dày hơn và cắt tab bằng máy.':'Estimated from specific cutting force; vibration and tool wear are not included — so the target safety factor is ≥ 2. Hand-break tabs (.030–.060) only when the load stays in the tab plane. The thrust column is for machining after release, when only tabs hold the part (setup 2): below 2, use thicker tabs and machine them off.'}</p></div>
 </div><div class="grid" style="align-content:start">
  <div class="card"><h2>${t('parts')}</h2><div class="grid" style="gap:8px">${N.items.map((it,i)=>`<div class="row"><select class="inp" style="flex:1" data-ni="${i}" data-k="src">${srcs.map(([v,l])=>`<option value="${v}" ${it.src===v?'selected':''}>${esc(l)}</option>`).join('')}</select><input class="inp" style="width:90px" inputmode="numeric" data-ni="${i}" data-k="qty" value="${it.qty}" aria-label="${t('qtyAuto')}"><button class="mini" data-nidel="${i}" style="color:var(--bad)">${IC.del}</button></div>`).join('')}
   <button class="btn sm" data-act="nestAdd">${IC.plus}${t('parts')}</button><p class="sub" style="margin:0;font-size:13px">${t('qtyAuto')}</p></div></div>
  <div class="card"><h2>${t('stock')}</h2><div class="fields">${L('sheetW','w')}${L('sheetH','h')}${L('sheetT','sheetT')}${L('partT2','partT')}${L('margin','margin')}
   <label class="f">${t('contourTool')}<select data-nb="tool" data-u="S">${S.tools.filter(x=>x.type==='flat').map(x=>`<option value="${x.id}" ${x.id===N.tool?'selected':''}>T${x.num} ${esc(x.desc)}</option>`).join('')}</select></label></div></div>
  <div class="card"><h2>Tab</h2><div class="fields">${L('tabW','tabW')}${L('tabT','tabT')}${L('tabEvery','tabEvery')}${Nn('tabFixed','tabFixed')}
   <label class="f">${t('nestMode')}<select data-nb="mode" data-u="S"><option value="flat" ${N.mode==='flat'?'selected':''}>${t('flatMode')}</option><option value="twoSide" ${N.mode==='twoSide'?'selected':''}>${t('twoSide')}</option></select></label>
   <label class="f">${t('hold')}<select data-nb="hold" data-u="S"><option value="screw" ${N.hold==='screw'?'selected':''}>${t('screw')}</option><option value="vacuum" ${N.hold==='vacuum'?'selected':''}>${t('vacuum')}</option></select></label>
   <label class="f">${t('removal')}<select data-nb="removal" data-u="S"><option value="break" ${N.removal==='break'?'selected':''}>${t('breakFile')}</option><option value="mill" ${N.removal==='mill'?'selected':''}>${t('millFix')}</option></select></label></div></div>
  <div class="card"><h2>${t('gcode')}</h2><div class="row" style="margin-bottom:10px"><button class="btn go" data-act="nestSave">${IC.save}${t('saveFile')}</button><button class="btn" data-act="nestCopy">${IC.copy}${t('copy')}</button><span class="ro" style="font-weight:600">${lines.length} ${t('lines')}</span></div>
   <pre class="code" style="max-height:300px">${hlG(NESTG.slice(0,20000))}</pre></div>
 </div></div>`;}

/* ================= 3D model from drawing ================= */
function modelGrid(){
 if(MODEL)return MODEL;const sr=stockRect(),W=sr[2]-sr[0],H=sr[3]-sr[1],res=Math.max(W,H)/170,nx=Math.max(2,Math.ceil(W/res)),ny=Math.max(2,Math.ceil(H/res)),th=thick(),h=new Float32Array(nx*ny).fill(NaN);
 const hm=getHM();const ex=new Set(S.excl||[]);const F=S.feats.filter(f=>!ex.has(f.id));const profs=F.filter(f=>f.kind==='profile'),pocks=F.filter(f=>f.kind==='pocket'),holes=F.filter(f=>f.kind==='holes');
 const depthOf=f=>{let d=null;for(const o of S.ops)if(o.on&&o.feat===f.id&&['adaptive','pocket','contour','circ','drill'].includes(o.type))d=Math.max(d??0,o.type==='drill'?-o.zBot-0.3*f.dia:-o.zBot);if(d==null)d=f.depth===undefined?(f.kind==='holes'?th+1:((S.def&&S.def.pocketDepth)||0.25)):(f.depth==null?th+1:f.depth);return d;};
 const pd=pocks.map(depthOf),hd=holes.map(depthOf);
 for(let j=0;j<ny;j++)for(let i=0;i<nx;i++){const x=sr[0]+(i+0.5)*res,y=sr[1]+(j+0.5)*res,k=j*nx+i;
  if(hm){const ii=Math.round((x-hm.x0)/hm.res),jj=Math.round((y-hm.y0)/hm.res);const z=ii>=0&&jj>=0&&ii<hm.nx&&jj<hm.ny?hm.h[jj*hm.nx+ii]:-1e9;h[k]=z<-th+0.002?NaN:Math.min(0,z);continue;}
  let z=profs.length?(profs.some(f=>C.pip([x,y],f.loop))?0:NaN):0;if(isNaN(z))continue;
  pocks.forEach((f,q)=>{if(C.pip([x,y],f.loop)&&!(f.islands||[]).some(l=>C.pip([x,y],l)))z=Math.min(z,-pd[q]);});
  holes.forEach((f,q)=>{const r=f.dia/2;for(const p of f.pts)if((x-p[0])**2+(y-p[1])**2<r*r)z=Math.min(z,-hd[q]);});
  h[k]=z<=-th+1e-4?NaN:z;}
 return MODEL={h,nx,ny,res,sr,bot:-th};}
function drawModel3D(cv){
 const dpr=Math.min(2,devicePixelRatio||1),W=cv.clientWidth,H=cv.clientHeight;cv.width=W*dpr;cv.height=H*dpr;const g=cv.getContext('2d');g.setTransform(dpr,0,0,dpr,0,0);g.clearRect(0,0,W,H);
 const M=modelGrid(),{h,nx,ny,res,sr,bot}=M,cx=(sr[0]+sr[2])/2,cy=(sr[1]+sr[3])/2,zc=bot/2;const cyw=Math.cos(VIEW.yaw),syw=Math.sin(VIEW.yaw),cp=Math.cos(VIEW.pitch),sp=Math.sin(VIEW.pitch);
 const span=Math.max(sr[2]-sr[0],sr[3]-sr[1],-bot*1.5),sc=Math.min(W,H)/span*0.78*VIEW.z3;
 const P=(x,y,z)=>{const dx=x-cx,dy=y-cy,xr=dx*cyw-dy*syw,yr=dx*syw+dy*cyw,zz=z-zc;return[W/2+xr*sc,H*0.5-(yr*cp+zz*sp)*sc,yr*sp-zz*cp];};
 const base=hexRGB('#5a82e6'),mc=hexRGB(mat().color),polys=[];const col=(c,l)=>`rgb(${Math.min(255,c[0]*l)|0},${Math.min(255,c[1]*l)|0},${Math.min(255,c[2]*l)|0})`;
 const topC=z=>{const k=Math.min(1,-z/Math.max(0.01,-bot));return[base[0]*(1-k)+mc[0]*k,base[1]*(1-k)+mc[1]*k,base[2]*(1-k)+mc[2]*k];};
 const vis=(nx_,ny_)=>(nx_*syw+ny_*cyw)<0;
 const Hn=(i,j)=>i<0||j<0||i>=nx||j>=ny?NaN:h[j*nx+i];
 for(let j=0;j<ny;j++)for(let i=0;i<nx;i++){const z=h[j*nx+i];if(isNaN(z))continue;const x0=sr[0]+i*res,x1=x0+res,y0=sr[1]+j*res,y1=y0+res;
  const q=[P(x0,y0,z),P(x1,y0,z),P(x1,y1,z),P(x0,y1,z)];polys.push([(q[0][2]+q[2][2])/2,q,col(topC(z),z>-1e-4?1:0.9)]);
  for(const[di,dj,ax,ay,bx,by,l] of [[0,-1,x0,y0,x1,y0,0.62],[0,1,x1,y1,x0,y1,0.5],[-1,0,x0,y1,x0,y0,0.56],[1,0,x1,y0,x1,y1,0.74]]){if(!vis(di,dj))continue;let nz=Hn(i+di,j+dj);if(isNaN(nz))nz=bot;if(nz>=z-1e-6)continue;
   const w=[P(ax,ay,z),P(bx,by,z),P(bx,by,nz),P(ax,ay,nz)];polys.push([(w[0][2]+w[2][2])/2+1e-4,w,col(isNaN(Hn(i+di,j+dj))?mc:topC(nz),l)]);}}
 polys.sort((a,b)=>b[0]-a[0]);for(const p of polys){const q=p[1];g.beginPath();g.moveTo(q[0][0],q[0][1]);for(let k=1;k<4;k++)g.lineTo(q[k][0],q[k][1]);g.closePath();g.fillStyle=p[2];g.strokeStyle=p[2];g.lineWidth=0.7;g.fill();g.stroke();}
 const info=$('#pvInfo');if(info)info.textContent=fl(sr[2]-sr[0],3)+' × '+fl(sr[3]-sr[1],3)+' × '+fl(-bot,3)+' '+ulab();}
function exportSTL(){
 const M=modelGrid(),{h,nx,ny,res,sr,bot}=M,k=K(),T=[];const Hn=(i,j)=>i<0||j<0||i>=nx||j>=ny?NaN:h[j*nx+i];
 const q=(a,b,c,d)=>{T.push([a,b,c],[a,c,d]);};
 for(let j=0;j<ny;j++)for(let i=0;i<nx;i++){const z=h[j*nx+i];if(isNaN(z))continue;const x0=sr[0]+i*res,x1=x0+res,y0=sr[1]+j*res,y1=y0+res;
  q([x0,y0,z],[x1,y0,z],[x1,y1,z],[x0,y1,z]);q([x0,y0,bot],[x0,y1,bot],[x1,y1,bot],[x1,y0,bot]);
  for(const[di,dj,a,b] of [[0,-1,[x0,y0],[x1,y0]],[0,1,[x1,y1],[x0,y1]],[-1,0,[x0,y1],[x0,y0]],[1,0,[x1,y0],[x1,y1]]]){let nz=Hn(i+di,j+dj);if(isNaN(nz))nz=bot;if(nz>=z-1e-6)continue;q([a[0],a[1],nz],[b[0],b[1],nz],[b[0],b[1],z],[a[0],a[1],z]);}}
 const buf=new ArrayBuffer(84+T.length*50/2),dv=new DataView(buf);const n=T.length/3;const out=new ArrayBuffer(84+n*50),o=new DataView(out);o.setUint32(80,n,true);
 for(let t_=0;t_<n;t_++){const a=T[3*t_],b=T[3*t_+1],c=T[3*t_+2];const ux=b[0]-a[0],uy=b[1]-a[1],uz=b[2]-a[2],vx=c[0]-a[0],vy=c[1]-a[1],vz=c[2]-a[2];let nx_=uy*vz-uz*vy,ny_=uz*vx-ux*vz,nz_=ux*vy-uy*vx;const L=Math.hypot(nx_,ny_,nz_)||1;
  const off=84+t_*50;[nx_/L,ny_/L,nz_/L,...a.map(v=>v*k),...b.map(v=>v*k),...c.map(v=>v*k)].forEach((v,m)=>o.setFloat32(off+m*4,v,true));}
 const base=(S.hdr.name||'PART').replace(/[^\w-]/g,'_');saveFile(base+'.zip',makeZip([{name:base+'_'+ulab()+'.stl',data:new Uint8Array(out)}]),true);}
/* ================= setup sheet PDF ================= */
function b64(s_){const b=atob(s_),u=new Uint8Array(b.length);for(let i=0;i<b.length;i++)u[i]=b.charCodeAt(i);return u;}
function makePDF(pages,pw,ph,m){const enc=new TextEncoder(),ch=[];let len=0;const offs=[];const add=x=>{const u=typeof x==='string'?enc.encode(x):x;ch.push(u);len+=u.length;};
 add('%PDF-1.4\n');const n=pages.length;const obj=(id,body)=>{offs[id]=len;add(id+' 0 obj\n'+body+'\nendobj\n');};
 obj(1,'<< /Type /Catalog /Pages 2 0 R >>');obj(2,'<< /Type /Pages /Kids ['+pages.map((_,i)=>(3+3*i)+' 0 R').join(' ')+'] /Count '+n+' >>');
 pages.forEach((p,i)=>{const pid=3+3*i,cid=pid+1,iid=pid+2;obj(pid,`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pw} ${ph}] /Resources << /XObject << /Im${i} ${iid} 0 R >> >> /Contents ${cid} 0 R >>`);
  const cs=`q ${p.dw.toFixed(2)} 0 0 ${p.dh.toFixed(2)} ${m} ${(ph-m-p.dh).toFixed(2)} cm /Im${i} Do Q`;obj(cid,`<< /Length ${cs.length} >>\nstream\n${cs}\nendstream`);
  offs[iid]=len;add(`${iid} 0 obj\n<< /Type /XObject /Subtype /Image /Width ${p.w} /Height ${p.h} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${p.jpg.length} >>\nstream\n`);add(p.jpg);add('\nendstream\nendobj\n');});
 const total=3+3*n,xref=len;let x='xref\n0 '+total+'\n0000000000 65535 f \n';for(let i=1;i<total;i++)x+=String(offs[i]).padStart(10,'0')+' 00000 n \n';add(x+'trailer\n<< /Size '+total+' /Root 1 0 R >>\nstartxref\n'+xref+'\n%%EOF');
 const out=new Uint8Array(len);let p=0;for(const u of ch){out.set(u,p);p+=u.length;}return out;}
async function setupPDF(){const el=$('.ss');if(!el)return;toast(t('pdfMaking'));
 try{if(!window.html2canvas)await loadScript('https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js');}catch(e){toast(t('pdfFail'));return;}
 let cv;try{cv=await window.html2canvas(el,{scale:2,backgroundColor:'#ffffff'});}catch(e){toast(t('pdfFail')+' ('+e.message+')');return;}
 const pw=612,ph=792,m=30,cw=pw-2*m,chh=ph-2*m,ppp=cv.width/cw,slice=Math.floor(chh*ppp),pages=[];
 for(let y=0;y<cv.height;y+=slice){const hh=Math.min(slice,cv.height-y),c=document.createElement('canvas');c.width=cv.width;c.height=hh;const g=c.getContext('2d');g.fillStyle='#fff';g.fillRect(0,0,c.width,hh);g.drawImage(cv,0,y,cv.width,hh,0,0,cv.width,hh);
  pages.push({jpg:b64(c.toDataURL('image/jpeg',0.9).split(',')[1]),w:c.width,h:hh,dw:cw,dh:hh/ppp});}
 saveFile(((S.hdr.name||'PART')+'-setup').replace(/[^\w-]/g,'_')+'.pdf',makePDF(pages,pw,ph,m));}

/* ================= save files ================= */
let DL=null;
(async()=>{try{if(window.claude&&window.claude.use)DL=await window.claude.use('downloads');}catch(_){DL=null;}})();
const CRC=(()=>{const t_=new Uint32Array(256);for(let n=0;n<256;n++){let c=n;for(let k=0;k<8;k++)c=c&1?0xEDB88320^(c>>>1):c>>>1;t_[n]=c>>>0;}return t_;})();
function crc32(u){let c=0xFFFFFFFF;for(let i=0;i<u.length;i++)c=CRC[(c^u[i])&255]^(c>>>8);return(c^0xFFFFFFFF)>>>0;}
function makeZip(files){const parts=[],cd=[];let off=0;const d=new Date(),dt=((d.getHours()<<11)|(d.getMinutes()<<5)|(d.getSeconds()>>1)),dd=(((d.getFullYear()-1980)<<9)|((d.getMonth()+1)<<5)|d.getDate());
 for(const f of files){const nm=new TextEncoder().encode(f.name),c=crc32(f.data),n=f.data.length;const h=new DataView(new ArrayBuffer(30));h.setUint32(0,0x04034b50,true);h.setUint16(4,20,true);h.setUint16(10,dt,true);h.setUint16(12,dd,true);h.setUint32(14,c,true);h.setUint32(18,n,true);h.setUint32(22,n,true);h.setUint16(26,nm.length,true);
  parts.push(new Uint8Array(h.buffer),nm,f.data);const ch=new DataView(new ArrayBuffer(46));ch.setUint32(0,0x02014b50,true);ch.setUint16(4,20,true);ch.setUint16(6,20,true);ch.setUint16(12,dt,true);ch.setUint16(14,dd,true);ch.setUint32(16,c,true);ch.setUint32(20,n,true);ch.setUint32(24,n,true);ch.setUint16(28,nm.length,true);ch.setUint32(42,off,true);cd.push(new Uint8Array(ch.buffer),nm);off+=30+nm.length+n;}
 const cdl=cd.reduce((a,b)=>a+b.length,0),e=new DataView(new ArrayBuffer(22));e.setUint32(0,0x06054b50,true);e.setUint16(8,files.length,true);e.setUint16(10,files.length,true);e.setUint32(12,cdl,true);e.setUint32(16,off,true);
 const all=[...parts,...cd,new Uint8Array(e.buffer)],out=new Uint8Array(all.reduce((a,b)=>a+b.length,0));let p=0;for(const a of all){out.set(a,p);p+=a.length;}return out;}
async function saveFile(name,data,isZip){
 if(!DL){try{if(window.claude&&window.claude.use)DL=await window.claude.use('downloads');}catch(_){}}
 if(!DL){toast(t('noSave'));return;}
 try{await DL.save({filename:name,data});toast(t('savedOk')+' '+name);if(isZip)setTimeout(()=>toast(t('zipHint')),1900);}catch(err){if(!err||err.code!=='declined')toast((err&&err.message)||t('noSave'));}}
function setupHTML(){const css=[...document.querySelectorAll('style')].map(x=>x.textContent).join('\n');const ss=document.querySelector('.ss');
 return'<!DOCTYPE html><html lang="vi"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>'+esc(S.hdr.name)+' setup sheet</title><style>'+css+'body{background:#fff;padding:16px}</style></head><body>'+(ss?ss.outerHTML:'')+'</body></html>';}

/* ================= windows: minimize / maximize ================= */
const WIN=new Set((()=>{try{return JSON.parse(localStorage.getItem('miniWin')||'[]');}catch(_){return[];}})());
function winKey(c,i){const h=c.querySelector('h2');return S.tab+':'+(h?h.textContent.trim().slice(0,30):i);}
function enhance(){
 $$('#main .card').forEach((c,i)=>{if(c.dataset.enh)return;const h=c.querySelector(':scope > h2, :scope > .row > h2');if(!h)return;c.dataset.enh=1;const key=winKey(c,i);c.dataset.key=key;const PAL=['#2457d6','#ff6a13','#1c9b5f','#8b4fd6','#0a9bb0','#e0457b','#e39b00'];if(!c.style.getPropertyValue('--cc'))c.style.setProperty('--cc',PAL[(TABS.indexOf(S.tab)+i)%PAL.length]);
  const host=h.parentElement===c?null:h.parentElement;let bar;
  if(host){bar=host;}else{bar=document.createElement('div');bar.className='winbar';c.insertBefore(bar,h);bar.appendChild(h);}
  const w=document.createElement('div');w.className='winbtns';w.innerHTML=`<button class="wb" data-win="min" aria-label="${t('minW')}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"><path d="M6 12h12"/></svg></button><button class="wb" data-win="max" aria-label="${t('maxW')}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/></svg></button>`;
  bar.appendChild(w);if(WIN.has(key))c.classList.add('min');});
 $$('#main .view').forEach(v=>{if(v.dataset.enh)return;v.dataset.enh=1;const b=document.createElement('button');b.className='mini vmax';b.dataset.win='vmax';b.setAttribute('aria-label',t('maxW'));b.innerHTML=IC.fit;const o=document.createElement('div');o.className='ovl br';o.appendChild(b);v.appendChild(o);});}
new MutationObserver(()=>enhance()).observe(document.getElementById('main'),{childList:true,subtree:true});
document.addEventListener('click',e=>{const b=e.target.closest('[data-win]');if(!b)return;e.stopPropagation();const w=b.dataset.win;
 if(w==='vmax'){const v=b.closest('.view');v.classList.toggle('maxi');document.body.classList.toggle('noscroll',v.classList.contains('maxi'));setTimeout(()=>{drawView();simDraw();},60);return;}
 const c=b.closest('.card');if(w==='min'){c.classList.remove('maxi');c.classList.toggle('min');const k=c.dataset.key;c.classList.contains('min')?WIN.add(k):WIN.delete(k);try{localStorage.setItem('miniWin',JSON.stringify([...WIN]));}catch(_){}}
 if(w==='max'){c.classList.remove('min');c.classList.toggle('maxi');document.body.classList.toggle('noscroll',c.classList.contains('maxi'));setTimeout(()=>{drawView();simDraw();},60);}},true);

/* ================= boot ================= */
try{LANG=localStorage.getItem('trakLang')||'vi';}catch(_){}
const had=restore();
if(!had||!S.raw){WARN=[];importDXF(demoDXF(),'demo-bracket.dxf','in');}else{applyZero();}
buildProgram();render();
}
