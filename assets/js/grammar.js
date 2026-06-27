/* =========================================================
   CHINESEIZI · grammar.js
   Ngữ pháp tiếng Trung theo cấp HSK 1→6 (cơ bản → nâng cao)
   Mỗi điểm: {hsk, title, struct (công thức), explain (giải thích Việt), ex:[{s,p,v}]}
   ========================================================= */
window.CZ_GRAMMAR=[
/* ---------------- HSK 1 ---------------- */
{hsk:1,title:"Câu với 是 (là)",struct:"A + 是 + B",explain:"Dùng 是 để khẳng định \"A là B\", nối hai danh từ/đại từ. Phủ định: 不是.",ex:[{s:"我是学生。",p:"wǒ shì xuéshēng.",v:"Tôi là học sinh."},{s:"他不是老师。",p:"tā bú shì lǎoshī.",v:"Anh ấy không phải giáo viên."}]},
{hsk:1,title:"的 chỉ sở hữu",struct:"A + 的 + N",explain:"的 nối người/vật sở hữu với danh từ, tương đương \"của\".",ex:[{s:"这是我的书。",p:"zhè shì wǒ de shū.",v:"Đây là sách của tôi."}]},
{hsk:1,title:"Câu hỏi với 吗",struct:"Câu trần thuật + 吗 ?",explain:"Thêm 吗 cuối câu khẳng định để tạo câu hỏi có/không.",ex:[{s:"你好吗？",p:"nǐ hǎo ma?",v:"Bạn khỏe không?"}]},
{hsk:1,title:"Phủ định 不 và 没",struct:"不 + V/Adj · 没(有) + V",explain:"不 phủ định hiện tại/tương lai/thói quen; 没(有) phủ định việc ĐÃ xảy ra.",ex:[{s:"我不喝咖啡。",p:"wǒ bù hē kāfēi.",v:"Tôi không uống cà phê."},{s:"我没去学校。",p:"wǒ méi qù xuéxiào.",v:"Tôi đã không đến trường."}]},
{hsk:1,title:"很 + tính từ làm vị ngữ",struct:"Chủ ngữ + 很 + Adj",explain:"Tính từ làm vị ngữ thường cần phó từ (vd 很). 很 ở đây nhiều khi chỉ là đệm, không nhất thiết \"rất\".",ex:[{s:"今天很热。",p:"jīntiān hěn rè.",v:"Hôm nay nóng."}]},
{hsk:1,title:"太……了",struct:"太 + Adj + 了",explain:"Diễn tả mức độ \"quá, rất\", thường mang sắc thái cảm thán.",ex:[{s:"太好了！",p:"tài hǎo le!",v:"Tuyệt quá!"}]},
{hsk:1,title:"想 / 要 (muốn)",struct:"想/要 + V",explain:"想 = muốn/dự định (nhẹ); 要 = muốn/cần (mạnh hơn, có ý sẽ làm).",ex:[{s:"我想喝茶。",p:"wǒ xiǎng hē chá.",v:"Tôi muốn uống trà."},{s:"我要买书。",p:"wǒ yào mǎi shū.",v:"Tôi muốn/sẽ mua sách."}]},
{hsk:1,title:"在 chỉ nơi chốn",struct:"A + 在 + nơi chốn",explain:"在 đứng trước địa điểm để nói \"ở đâu\".",ex:[{s:"他在家。",p:"tā zài jiā.",v:"Anh ấy ở nhà."}]},
{hsk:1,title:"Lượng từ",struct:"Số từ + Lượng từ + Danh từ",explain:"Giữa số và danh từ phải có lượng từ; 个 là lượng từ chung nhất.",ex:[{s:"三个人",p:"sān gè rén",v:"ba người"},{s:"两本书",p:"liǎng běn shū",v:"hai quyển sách"}]},
{hsk:1,title:"Hỏi giờ với 几",struct:"现在几点？",explain:"几 hỏi số lượng nhỏ; 几点 hỏi mấy giờ.",ex:[{s:"现在几点？",p:"xiànzài jǐ diǎn?",v:"Bây giờ mấy giờ?"}]},
{hsk:1,title:"Từ để hỏi (什么/谁/哪儿)",struct:"đặt từ hỏi vào vị trí cần hỏi",explain:"Tiếng Trung KHÔNG đảo trật tự khi hỏi: để từ hỏi đúng chỗ của thành phần cần hỏi.",ex:[{s:"你叫什么名字？",p:"nǐ jiào shénme míngzi?",v:"Bạn tên là gì?"},{s:"他去哪儿？",p:"tā qù nǎr?",v:"Anh ấy đi đâu?"}]},

/* ---------------- HSK 2 ---------------- */
{hsk:2,title:"So sánh với 比",struct:"A + 比 + B + Adj",explain:"比 dùng so sánh hơn. Có thể thêm mức độ: 比…大一点儿 / 大得多.",ex:[{s:"今天比昨天热。",p:"jīntiān bǐ zuótiān rè.",v:"Hôm nay nóng hơn hôm qua."}]},
{hsk:2,title:"因为……所以……",struct:"因为 + nguyên nhân, 所以 + kết quả",explain:"Cặp quan hệ nhân-quả \"vì… nên…\".",ex:[{s:"因为下雨，所以我没去。",p:"yīnwèi xiàyǔ, suǒyǐ wǒ méi qù.",v:"Vì trời mưa nên tôi không đi."}]},
{hsk:2,title:"离 chỉ khoảng cách",struct:"A + 离 + B + 远/近",explain:"离 nói khoảng cách giữa hai điểm (xa/gần).",ex:[{s:"我家离公司很近。",p:"wǒ jiā lí gōngsī hěn jìn.",v:"Nhà tôi cách công ty rất gần."}]},
{hsk:2,title:"从……到……",struct:"从 + điểm đầu + 到 + điểm cuối",explain:"Chỉ phạm vi thời gian hoặc không gian \"từ… đến…\".",ex:[{s:"从八点到十点。",p:"cóng bā diǎn dào shí diǎn.",v:"Từ 8 giờ đến 10 giờ."}]},
{hsk:2,title:"了 chỉ hành động hoàn thành",struct:"V + 了 (+ tân ngữ)",explain:"了 sau động từ chỉ hành động đã xảy ra/hoàn thành.",ex:[{s:"我吃了饭。",p:"wǒ chī le fàn.",v:"Tôi đã ăn cơm."}]},
{hsk:2,title:"过 chỉ kinh nghiệm",struct:"V + 过",explain:"过 diễn tả \"từng\" trải nghiệm việc gì đó.",ex:[{s:"我去过北京。",p:"wǒ qù guò běijīng.",v:"Tôi đã từng đến Bắc Kinh."}]},
{hsk:2,title:"正在 / 在 (đang)",struct:"(正)在 + V (+ 呢)",explain:"Diễn tả hành động đang tiếp diễn.",ex:[{s:"他正在打电话。",p:"tā zhèngzài dǎ diànhuà.",v:"Anh ấy đang gọi điện."}]},
{hsk:2,title:"Bổ ngữ mức độ với 得",struct:"V + 得 + Adj",explain:"得 nối động từ với mức độ/đánh giá của hành động.",ex:[{s:"他跑得很快。",p:"tā pǎo de hěn kuài.",v:"Anh ấy chạy rất nhanh."}]},
{hsk:2,title:"一点儿 vs 有点儿",struct:"Adj+(一)点儿 · 有点儿+Adj",explain:"有点儿 + tính từ (thường nghĩa tiêu cực, \"hơi\"); tính từ + 一点儿 (so sánh, \"…hơn một chút\").",ex:[{s:"今天有点儿冷。",p:"jīntiān yǒudiǎnr lěng.",v:"Hôm nay hơi lạnh."},{s:"便宜一点儿。",p:"piányi yìdiǎnr.",v:"Rẻ hơn một chút đi."}]},
{hsk:2,title:"要……了 (sắp)",struct:"(快)要 + V + 了",explain:"Diễn tả việc sắp xảy ra.",ex:[{s:"火车要开了。",p:"huǒchē yào kāi le.",v:"Tàu sắp chạy rồi."}]},
{hsk:2,title:"还是 vs 或者",struct:"câu hỏi: A 还是 B · câu kể: A 或者 B",explain:"还是 dùng trong câu hỏi lựa chọn; 或者 dùng trong câu trần thuật.",ex:[{s:"你喝茶还是咖啡？",p:"nǐ hē chá háishì kāfēi?",v:"Bạn uống trà hay cà phê?"}]},

/* ---------------- HSK 3 ---------------- */
{hsk:3,title:"Câu chữ 把",struct:"S + 把 + O + V + thành phần khác",explain:"Đưa tân ngữ lên trước động từ để nhấn mạnh sự xử lí/tác động lên nó. Sau V phải có thành phần khác (了, bổ ngữ…).",ex:[{s:"请把门关上。",p:"qǐng bǎ mén guān shàng.",v:"Xin đóng cửa lại."}]},
{hsk:3,title:"Câu bị động 被",struct:"O + 被 (+ chủ thể) + V + …",explain:"Diễn tả \"bị/được\" ai đó tác động.",ex:[{s:"杯子被他打破了。",p:"bēizi bèi tā dǎpò le.",v:"Cái cốc bị anh ấy làm vỡ."}]},
{hsk:3,title:"着 chỉ trạng thái kéo dài",struct:"V + 着",explain:"着 diễn tả trạng thái/hành động đang duy trì.",ex:[{s:"门开着。",p:"mén kāi zhe.",v:"Cửa đang mở."}]},
{hsk:3,title:"一……就……",struct:"一 + V1, 就 + V2",explain:"\"Vừa… là (liền)…\": hai việc nối tiếp ngay.",ex:[{s:"我一回家就睡觉。",p:"wǒ yì huí jiā jiù shuìjiào.",v:"Tôi vừa về nhà là đi ngủ."}]},
{hsk:3,title:"虽然……但是……",struct:"虽然 + A, 但是/可是 + B",explain:"Quan hệ nhượng bộ \"tuy… nhưng…\".",ex:[{s:"虽然很累，但是很开心。",p:"suīrán hěn lèi, dànshì hěn kāixīn.",v:"Tuy mệt nhưng rất vui."}]},
{hsk:3,title:"越来越 / 越……越……",struct:"越来越 + Adj · 越 + A + 越 + B",explain:"越来越 = ngày càng; 越…越… = càng… càng…",ex:[{s:"天气越来越冷。",p:"tiānqì yuèláiyuè lěng.",v:"Thời tiết ngày càng lạnh."},{s:"越说越快。",p:"yuè shuō yuè kuài.",v:"Càng nói càng nhanh."}]},
{hsk:3,title:"除了……以外",struct:"除了 + A + 以外, 都/也/还 + …",explain:"\"Ngoài A ra\": có thể là loại trừ (都) hoặc bổ sung (还/也).",ex:[{s:"除了他以外，我们都去。",p:"chúle tā yǐwài, wǒmen dōu qù.",v:"Ngoài anh ấy ra, chúng tôi đều đi."}]},
{hsk:3,title:"Bổ ngữ kết quả",struct:"V + 完/好/到/见/懂…",explain:"Thêm động/tính từ sau V để nói kết quả của hành động.",ex:[{s:"我听懂了。",p:"wǒ tīng dǒng le.",v:"Tôi nghe hiểu rồi."},{s:"作业做完了。",p:"zuòyè zuò wán le.",v:"Bài tập làm xong rồi."}]},
{hsk:3,title:"Bổ ngữ xu hướng (来/去)",struct:"V + 来/去 / 上来 / 出去…",explain:"来/去 chỉ hướng di chuyển so với người nói.",ex:[{s:"他跑过来了。",p:"tā pǎo guòlái le.",v:"Anh ấy chạy lại đây."}]},
{hsk:3,title:"Câu 是……的",struct:"是 + (thời gian/nơi/cách thức) + 的",explain:"Nhấn mạnh thông tin về thời gian, địa điểm, phương thức của một việc ĐÃ xảy ra.",ex:[{s:"我是昨天来的。",p:"wǒ shì zuótiān lái de.",v:"Tôi đến (là) hôm qua."}]},
{hsk:3,title:"不但……而且……",struct:"不但 + A, 而且 + B",explain:"Quan hệ tăng tiến \"không những… mà còn…\".",ex:[{s:"她不但聪明，而且努力。",p:"tā búdàn cōngming, érqiě nǔlì.",v:"Cô ấy không những thông minh mà còn chăm chỉ."}]},

/* ---------------- HSK 4 ---------------- */
{hsk:4,title:"不是……而是……",struct:"不是 + A, 而是 + B",explain:"\"Không phải A mà là B\" — phủ định cái này, khẳng định cái kia.",ex:[{s:"这不是茶，而是咖啡。",p:"zhè bú shì chá, ér shì kāfēi.",v:"Đây không phải trà mà là cà phê."}]},
{hsk:4,title:"既……又……",struct:"既 + A + 又 + B",explain:"\"Vừa… vừa…\": nêu hai tính chất cùng tồn tại.",ex:[{s:"这件衣服既便宜又好看。",p:"zhè jiàn yīfu jì piányi yòu hǎokàn.",v:"Bộ đồ này vừa rẻ vừa đẹp."}]},
{hsk:4,title:"即使……也……",struct:"即使 + A, 也 + B",explain:"\"Dù cho… thì cũng…\": giả thiết nhượng bộ.",ex:[{s:"即使下雨，我也去。",p:"jíshǐ xiàyǔ, wǒ yě qù.",v:"Dù trời mưa tôi cũng đi."}]},
{hsk:4,title:"无论/不管……都……",struct:"无论 + (từ hỏi/lựa chọn) + 都/也",explain:"\"Bất kể… đều…\": kết quả không đổi trong mọi trường hợp.",ex:[{s:"无论多难，我都不放弃。",p:"wúlùn duō nán, wǒ dōu bú fàngqì.",v:"Dù khó thế nào tôi cũng không bỏ cuộc."}]},
{hsk:4,title:"只要……就…… / 只有……才……",struct:"只要 A 就 B · 只有 A 才 B",explain:"只要…就… = chỉ cần (điều kiện đủ); 只有…才… = chỉ có… mới… (điều kiện cần duy nhất).",ex:[{s:"只要努力就会成功。",p:"zhǐyào nǔlì jiù huì chénggōng.",v:"Chỉ cần cố gắng là sẽ thành công."},{s:"只有多练习才能提高。",p:"zhǐyǒu duō liànxí cái néng tígāo.",v:"Chỉ có luyện nhiều mới tiến bộ."}]},
{hsk:4,title:"随着",struct:"随着 + A, B",explain:"\"Cùng với / theo (sự thay đổi của A)…\".",ex:[{s:"随着时间，他汉语越来越好。",p:"suízhe shíjiān, tā hànyǔ yuèláiyuè hǎo.",v:"Theo thời gian, tiếng Trung của anh ấy ngày càng tốt."}]},
{hsk:4,title:"由于……因此/因而……",struct:"由于 + nguyên nhân, 因此 + kết quả",explain:"Nhân-quả trang trọng hơn 因为…所以…",ex:[{s:"由于天气不好，比赛取消了。",p:"yóuyú tiānqì bù hǎo, bǐsài qǔxiāo le.",v:"Do thời tiết xấu, trận đấu bị hủy."}]},
{hsk:4,title:"通过",struct:"通过 + phương tiện/cách, …",explain:"\"Thông qua / bằng cách…\".",ex:[{s:"通过努力，他实现了梦想。",p:"tōngguò nǔlì, tā shíxiàn le mèngxiǎng.",v:"Bằng nỗ lực, anh ấy đã thực hiện ước mơ."}]},
{hsk:4,title:"反而",struct:"…, 反而 + (điều trái mong đợi)",explain:"\"Ngược lại / trái lại\": kết quả trái với dự đoán.",ex:[{s:"吃了药，病反而更重了。",p:"chī le yào, bìng fǎn'ér gèng zhòng le.",v:"Uống thuốc rồi bệnh lại nặng hơn."}]},
{hsk:4,title:"尽管……还是……",struct:"尽管 + A, 还是 + B",explain:"\"Mặc dù… vẫn…\": nhượng bộ, kết quả không đổi.",ex:[{s:"尽管很忙，他还是来了。",p:"jǐnguǎn hěn máng, tā háishì lái le.",v:"Mặc dù bận, anh ấy vẫn đến."}]},

/* ---------------- HSK 5 ---------------- */
{hsk:5,title:"不仅……还/而且……",struct:"不仅 + A, 还/而且/也 + B",explain:"\"Không chỉ… mà còn…\" (trang trọng hơn 不但).",ex:[{s:"他不仅会说汉语，还会写。",p:"tā bùjǐn huì shuō hànyǔ, hái huì xiě.",v:"Anh ấy không chỉ nói được tiếng Trung mà còn viết được."}]},
{hsk:5,title:"哪怕……也……",struct:"哪怕 + A, 也 + B",explain:"\"Cho dù (giả định cực đoan)… cũng…\".",ex:[{s:"哪怕只有一点机会，我也要试。",p:"nǎpà zhǐ yǒu yìdiǎn jīhuì, wǒ yě yào shì.",v:"Dù chỉ có chút cơ hội tôi cũng phải thử."}]},
{hsk:5,title:"万一",struct:"万一 + tình huống xấu",explain:"\"Lỡ / nhỡ may…\": giả thiết khả năng nhỏ, thường tiêu cực.",ex:[{s:"万一下雨怎么办？",p:"wànyī xiàyǔ zěnme bàn?",v:"Lỡ trời mưa thì làm sao?"}]},
{hsk:5,title:"宁可……也(不)……",struct:"宁可 + A + 也不 + B",explain:"\"Thà… chứ không…\": lựa chọn dù không như ý.",ex:[{s:"我宁可走路也不坐他的车。",p:"wǒ nìngkě zǒulù yě bù zuò tā de chē.",v:"Tôi thà đi bộ chứ không đi xe của anh ta."}]},
{hsk:5,title:"凡是……都……",struct:"凡是 + A, 都 + B",explain:"\"Phàm là / hễ là… đều…\": khái quát toàn bộ.",ex:[{s:"凡是学生都要考试。",p:"fánshì xuéshēng dōu yào kǎoshì.",v:"Hễ là học sinh đều phải thi."}]},
{hsk:5,title:"以便 / 以免",struct:"…, 以便 + mục đích · 以免 + điều cần tránh",explain:"以便 = để (thuận tiện cho); 以免 = để khỏi/tránh.",ex:[{s:"早点出发，以免迟到。",p:"zǎodiǎn chūfā, yǐmiǎn chídào.",v:"Đi sớm để khỏi muộn."}]},
{hsk:5,title:"多亏",struct:"多亏 + (người/việc giúp), 才…",explain:"\"May nhờ / nhờ có…\": biết ơn vì điều tốt đã xảy ra.",ex:[{s:"多亏你帮忙，我才完成了。",p:"duōkuī nǐ bāngmáng, wǒ cái wánchéng le.",v:"Nhờ bạn giúp tôi mới hoàn thành được."}]},
{hsk:5,title:"难免",struct:"难免 + (việc khó tránh)",explain:"\"Khó tránh khỏi…\".",ex:[{s:"刚开始学，难免会出错。",p:"gāng kāishǐ xué, nánmiǎn huì chūcuò.",v:"Mới học thì khó tránh mắc lỗi."}]},
{hsk:5,title:"是否",struct:"…是否…",explain:"\"Có… hay không\" (văn viết, trang trọng hơn 吗/…不…).",ex:[{s:"请告诉我你是否同意。",p:"qǐng gàosu wǒ nǐ shìfǒu tóngyì.",v:"Hãy cho tôi biết bạn có đồng ý không."}]},
{hsk:5,title:"与其……不如……",struct:"与其 + A, 不如 + B",explain:"\"Thà… còn hơn… / so với A chi bằng B\": chọn B.",ex:[{s:"与其等待，不如行动。",p:"yǔqí děngdài, bùrú xíngdòng.",v:"Thay vì chờ đợi, chi bằng hành động."}]},

/* ---------------- HSK 6 ---------------- */
{hsk:6,title:"一旦……就……",struct:"一旦 + A, 就 + B",explain:"\"Một khi… thì…\": giả thiết một khi điều gì xảy ra.",ex:[{s:"一旦做了决定，就不要后悔。",p:"yídàn zuò le juédìng, jiù bú yào hòuhuǐ.",v:"Một khi đã quyết định thì đừng hối hận."}]},
{hsk:6,title:"倘若 / 假如",struct:"倘若/假如 + A, (就/便) B",explain:"\"Nếu như…\" (văn viết, trang trọng).",ex:[{s:"倘若有机会，我一定去。",p:"tǎngruò yǒu jīhuì, wǒ yídìng qù.",v:"Nếu có cơ hội, nhất định tôi sẽ đi."}]},
{hsk:6,title:"之所以……是因为……",struct:"A 之所以 B, 是因为 C",explain:"Đảo nhân-quả để nhấn mạnh: \"sở dĩ A B là vì C\".",ex:[{s:"他之所以成功，是因为努力。",p:"tā zhīsuǒyǐ chénggōng, shì yīnwèi nǔlì.",v:"Sở dĩ anh ấy thành công là vì nỗ lực."}]},
{hsk:6,title:"未免",struct:"未免 + (đánh giá hơi quá)",explain:"\"Không khỏi (thấy) hơi…\": nhận xét nhẹ rằng điều gì hơi quá mức.",ex:[{s:"这样做未免太过分了。",p:"zhèyàng zuò wèimiǎn tài guòfèn le.",v:"Làm vậy thì hơi quá đáng rồi."}]},
{hsk:6,title:"不至于",struct:"不至于 + (kết quả xấu)",explain:"\"Không đến mức…\": phủ định một hệ quả tiêu cực quá đà.",ex:[{s:"他不至于骗你吧。",p:"tā bú zhìyú piàn nǐ ba.",v:"Anh ấy không đến mức lừa bạn đâu."}]},
{hsk:6,title:"以至于",struct:"…, 以至于 + kết quả",explain:"\"Đến nỗi / dẫn đến…\": kết quả (thường ngoài ý muốn) do mức độ cao.",ex:[{s:"他太累了，以至于睡着了。",p:"tā tài lèi le, yǐzhìyú shuìzháo le.",v:"Anh ấy mệt đến nỗi ngủ thiếp đi."}]},
{hsk:6,title:"鉴于",struct:"鉴于 + tình hình, …",explain:"\"Xét/căn cứ vào…\" (văn phong trang trọng, công văn).",ex:[{s:"鉴于情况特殊，我们同意了。",p:"jiànyú qíngkuàng tèshū, wǒmen tóngyì le.",v:"Xét tình hình đặc biệt, chúng tôi đã đồng ý."}]},
{hsk:6,title:"何况",struct:"…, (更)何况 + B",explain:"\"Huống hồ / nói gì đến…\": tăng tiến, B còn hiển nhiên hơn.",ex:[{s:"大人都做不到，何况孩子。",p:"dàrén dōu zuò bú dào, hékuàng háizi.",v:"Người lớn còn không làm được, huống hồ trẻ con."}]},
{hsk:6,title:"宁愿……也……",struct:"宁愿 + A + 也 + B",explain:"\"Thà… cũng (chấp nhận)…\": kiên quyết chọn A dù phải chịu B.",ex:[{s:"她宁愿自己累，也要帮别人。",p:"tā nìngyuàn zìjǐ lèi, yě yào bāng biérén.",v:"Cô ấy thà mình vất vả cũng muốn giúp người khác."}]}
];
window.CZ_GRAMMAR_READY=true;

/* ===================== VIEW: Ngữ pháp ===================== */
(function(){
"use strict";
var CZ=window.CZ; if(!CZ) return;
var G=window.CZ_GRAMMAR||[];
var esc=CZ._esc||function(s){return String(s==null?'':s);};
var hskBadge=CZ._hsk||function(n){return '<span class="hsk-badge hsk-'+n+'">HSK '+n+'</span>';};
function app(){ return document.getElementById('app'); }

var gSel='hsk:1';
function viewGrammar(arg){
  gSel=arg||'hsk:1';
  var lvl = gSel.indexOf('hsk:')===0 ? +gSel.slice(4) : 0;
  var list = lvl ? G.filter(function(x){return x.hsk===lvl;}) : G;
  var levels=[['hsk:1','HSK 1'],['hsk:2','HSK 2'],['hsk:3','HSK 3'],['hsk:4','HSK 4'],['hsk:5','HSK 5'],['hsk:6','HSK 6'],['all','Tất cả']];
  var segHtml=levels.map(function(l){
    return '<button class="'+(gSel===l[0]?'active':'')+'" onclick="CZ.go(\'grammar/'+l[0]+'\')">'+l[1]+'</button>';
  }).join('');
  var cards=list.map(function(g){
    var exHtml=(g.ex||[]).map(function(e){
      return '<div class="gram-ex">'+
        '<span class="gram-speak" title="Nghe" onclick="CZ.say(\''+esc(e.s)+'\',this)">🔊</span>'+
        '<div class="gram-zh zh" onclick="CZ.say(\''+esc(e.s)+'\',this)">'+esc(e.s)+'</div>'+
        '<div class="gram-p">'+esc(e.p)+'</div><div class="gram-v">'+esc(e.v)+'</div></div>';
    }).join('');
    return '<div class="card gram-card">'+
      '<div class="gram-head">'+hskBadge(g.hsk)+'<span class="gram-title">'+esc(g.title)+'</span></div>'+
      '<div class="gram-struct zh">'+esc(g.struct)+'</div>'+
      '<div class="gram-explain">'+esc(g.explain)+'</div>'+
      exHtml+
    '</div>';
  }).join('');
  app().innerHTML=
  '<div class="view">'+
    '<div class="section-title">📖 Ngữ pháp tiếng Trung <span style="color:var(--muted);font-weight:700;font-size:15px">('+list.length+' điểm)</span></div>'+
    '<div style="color:var(--muted);font-weight:700;margin:-6px 0 14px">Học theo cấp HSK 1→6 · cơ bản đến nâng cao</div>'+
    '<div class="seg" style="margin-bottom:18px">'+segHtml+'</div>'+
    '<div class="gram-grid">'+(cards||'<div class="empty">Chưa có nội dung.</div>')+'</div>'+
  '</div>';
}

/* CSS bơm thẳng */
var css=
'.gram-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:16px}'+
'.gram-card{border-left:5px solid var(--violet)}'+
'.gram-head{display:flex;align-items:center;gap:10px;margin-bottom:10px}'+
'.gram-title{font-size:18px;font-weight:900;color:var(--ink)}'+
'.gram-struct{display:inline-block;background:var(--grad-soft);color:var(--violet-700);font-weight:800;'+
'padding:6px 12px;border-radius:10px;font-size:15px;margin-bottom:8px}'+
'.gram-explain{color:var(--ink);font-weight:600;margin-bottom:10px;line-height:1.6}'+
'.gram-ex{background:#faf7ff;border:1px solid var(--line);border-radius:12px;padding:10px 14px;margin-top:8px;position:relative}'+
'.gram-speak{position:absolute;right:10px;top:10px;cursor:pointer;font-size:16px;background:#f3eaff;border-radius:8px;padding:2px 6px}'+
'.gram-zh{font-size:18px;font-weight:700;cursor:pointer;padding-right:30px}'+
'.gram-p{color:var(--violet);font-weight:700;font-size:14px}'+
'.gram-v{color:var(--muted)}'+
'.hc-grammar{background:linear-gradient(135deg,#5f8fd0,#8e7fd6)}'+
'@media(max-width:760px){.gram-grid{grid-template-columns:1fr}}';
var st=document.createElement('style'); st.textContent=css; document.head.appendChild(st);

/* thêm link "Ngữ pháp" vào thanh nav (nếu chưa có) */
function injectNav(){
  var nav=document.getElementById('nav'); if(!nav) return;
  if(nav.querySelector('[data-route="grammar"]')) return;
  var a=document.createElement('a'); a.href='#grammar'; a.setAttribute('data-route','grammar'); a.textContent='Ngữ pháp';
  var anchor=nav.querySelector('[data-route="test"]');   // chèn sau "Thi thử"
  if(anchor && anchor.nextSibling) nav.insertBefore(a, anchor.nextSibling);
  else { var pill=document.getElementById('streakPill'); if(pill) nav.insertBefore(a,pill); else nav.appendChild(a); }
}
injectNav();

if(CZ._setViews) CZ._setViews({ grammar:viewGrammar });
if(location.hash.indexOf('#grammar')===0 && CZ._render) CZ._render();
})();
