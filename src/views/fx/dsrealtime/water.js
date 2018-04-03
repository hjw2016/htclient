var tpl = `<div class="water-level-wrapper">
	<div class="arrow"></div>
	<div class="water-header">
		<div class="water-title">
			<%=data.ZMNM + ":"%>
		</div>
		<span class="<%=(data.ZQSW < data.ZHSW) && (data.KD || data.LL) ? 'red' : '' %>"><%=(data.LL||0).toFixed(2) + "m³/s" + (data.LL > 0 && data.RTUNM1 && data.RTUNM1 !== "无" && data.RTUNM2 && data.RTUNM2 !== "无" ? "(参考值)" : "") %><span>
	</div>
	<div class="water-content">
		<div class="water-upper">
			<div class="water-level-z">
				<%=data.ZQSW==-9999 ? "设备故障" : (data.ZQSW || 0).toFixed(2)+"m"%>
				<div><%=data.RTUNM ? "("+data.RTUNM+")" : ""%></div>
			</div>
			<div class="water-level-bg<%= data.ZQSW > data.ZHSW ? ' water-level-max' : ' water-level-min' %>"></div>
			<div class="water-level-label">闸上</div>
		</div>
		<div class="water-gate">
			<div class="<%= (data.LL || data.KD) > 0 ? 'water-gate-on' : 'water-gate-off' %>"></div>
		</div>
		<div class="water-down">
			<div class="water-level-z">
				<%=data.ZHSW==-9999 ? "设备故障" : (data.ZHSW || 0).toFixed(2)+"m"%>
				<div><%=data.RTUNM1 && data.RTUNM1 !== "无" && data.RTUNM2 && data.RTUNM2 !== "无" ? "(参考站:" + data.RTUNM1 + "," + data.RTUNM2 + ")" : data.RTUNM1 && data.RTUNM1 !=="无" ? "(" + data.RTUNM1 +")" : "" %></div>
			</div>
			<div class="water-level-bg<%= data.ZHSW > data.ZQSW ? ' water-level-max' : ' water-level-min' %>"></div>
			<div class="water-level-label">闸下</div>
		</div>
	</div>
</div>`
export default tpl;