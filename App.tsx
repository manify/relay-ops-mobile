import { StatusBar } from 'expo-status-bar';
import React, { useMemo, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View, useWindowDimensions } from 'react-native';

type Severity = 'All' | 'P1' | 'P2' | 'P3';
type Incident = { id: string; title: string; service: string; severity: Exclude<Severity, 'All'>; age: string; owner: string; status: string };
const C = { bg: '#090B12', panel: '#121622', line: '#242A3B', text: '#F7F8FC', muted: '#9099AD', violet: '#A98BFF', cyan: '#63E6FF', red: '#FF6B76', amber: '#FFCA69', green: '#6EE7A0' };
const initialIncidents: Incident[] = [
  { id: 'INC-284', title: 'Checkout latency above SLO', service: 'payments-api', severity: 'P1', age: '12m', owner: 'AM', status: 'Mitigating' },
  { id: 'INC-283', title: 'Delayed fulfillment webhooks', service: 'order-events', severity: 'P2', age: '34m', owner: 'SK', status: 'Investigating' },
  { id: 'INC-279', title: 'Elevated image processing errors', service: 'media-worker', severity: 'P3', age: '2h', owner: 'JL', status: 'Monitoring' },
];
const timeline = [
  ['10:42', 'Traffic shifted to eu-west replica', 'Automated action · Relay Bot'],
  ['10:39', 'Database connection pool increased to 120', 'Manav · Incident commander'],
  ['10:34', 'P95 crossed the 800 ms alert threshold', 'Datadog integration'],
] as const;

function HealthBars() {
  const values = [99, 99, 97, 96, 92, 88, 82, 72, 77, 86, 91, 95, 97, 98];
  return <View style={s.healthBars}>{values.map((v, i) => <View key={i} style={[s.healthBar, { height: `${v}%`, backgroundColor: v < 80 ? C.red : v < 92 ? C.amber : C.green }]} />)}</View>;
}
function Metric({ label, value, meta, color }: { label: string; value: string; meta: string; color: string }) {
  return <View style={s.metric}><View style={[s.metricDot, { backgroundColor: color }]} /><Text style={s.metricLabel}>{label}</Text><Text style={s.metricValue}>{value}</Text><Text style={s.metricMeta}>{meta}</Text></View>;
}

export default function App() {
  const { width } = useWindowDimensions();
  const compact = width < 760;
  const [severity, setSeverity] = useState<Severity>('All');
  const [incidents, setIncidents] = useState(initialIncidents);
  const [acknowledged, setAcknowledged] = useState(false);
  const visible = useMemo(() => severity === 'All' ? incidents : incidents.filter(i => i.severity === severity), [incidents, severity]);
  const resolve = (id: string) => setIncidents(current => current.filter(item => item.id !== id));
  return <SafeAreaView style={s.safe}><StatusBar style="light" /><ScrollView contentContainerStyle={s.page} showsVerticalScrollIndicator={false}>
    <View style={s.header}>
      <View style={s.brandRow}><View style={s.brandMark}><Text style={s.brandGlyph}>R</Text></View><View><Text style={s.brand}>RELAY</Text><Text style={s.workspace}>NORTHSTAR / PRODUCTION</Text></View></View>
      <View style={s.headerRight}><View style={s.onCall}><View style={s.greenDot} /><Text style={s.onCallText}>ON CALL · MANAV</Text></View><TouchableOpacity style={s.avatar}><Text style={s.avatarText}>MO</Text></TouchableOpacity></View>
    </View>

    <View style={s.hero}>
      <View><Text style={s.kicker}>OPERATIONS OVERVIEW</Text><Text style={s.title}>Your systems, in context.</Text><Text style={s.subtitle}>One live incident. Core services are recovering.</Text></View>
      <TouchableOpacity onPress={() => setAcknowledged(v => !v)} style={[s.primaryButton, acknowledged && s.ackButton]}><Text style={s.primaryButtonText}>{acknowledged ? '✓  PAGE ACKNOWLEDGED' : 'ACKNOWLEDGE PAGE'}</Text></TouchableOpacity>
    </View>

    <View style={[s.metrics, compact && s.wrap]}>
      <Metric label="GLOBAL UPTIME" value="99.97%" meta="30-day rolling" color={C.green} />
      <Metric label="P95 LATENCY" value="742 ms" meta="↓ 18% in 10 min" color={C.amber} />
      <Metric label="ERROR RATE" value="1.24%" meta="Target < 0.50%" color={C.red} />
      <Metric label="ACTIVE SERVICES" value="42 / 44" meta="2 degraded" color={C.violet} />
    </View>

    <View style={[s.mainGrid, compact && s.stack]}>
      <View style={[s.panel, compact ? s.full : s.left]}>
        <View style={s.rowBetween}><View><Text style={s.sectionTitle}>Live incidents</Text><Text style={s.sectionSub}>{incidents.length} active across production</Text></View><View style={s.filters}>{(['All', 'P1', 'P2', 'P3'] as Severity[]).map(item => <TouchableOpacity key={item} onPress={() => setSeverity(item)} style={[s.filter, severity === item && s.filterActive]}><Text style={[s.filterText, severity === item && s.filterTextActive]}>{item}</Text></TouchableOpacity>)}</View></View>
        {visible.length === 0 ? <View style={s.empty}><Text style={s.emptyIcon}>✓</Text><Text style={s.emptyTitle}>No matching incidents</Text><Text style={s.sectionSub}>All clear in this severity band.</Text></View> : visible.map((incident, index) => <View key={incident.id} style={[s.incident, index > 0 && s.borderTop]}>
          <View style={[s.severity, { backgroundColor: incident.severity === 'P1' ? C.red : incident.severity === 'P2' ? C.amber : C.violet }]}><Text style={s.severityText}>{incident.severity}</Text></View>
          <View style={s.incidentBody}><Text style={s.incidentTitle}>{incident.title}</Text><Text style={s.incidentMeta}>{incident.id}  ·  {incident.service}  ·  {incident.age}</Text><View style={s.ownerRow}><View style={s.owner}><Text style={s.ownerText}>{incident.owner}</Text></View><Text style={s.status}>{incident.status}</Text></View></View>
          <TouchableOpacity onPress={() => resolve(incident.id)} style={s.resolveButton}><Text style={s.resolveText}>RESOLVE</Text></TouchableOpacity>
        </View>)}
      </View>
      <View style={[s.panel, compact ? s.full : s.right]}>
        <View style={s.rowBetween}><View><Text style={s.sectionTitle}>Service health</Text><Text style={s.sectionSub}>Last 60 minutes</Text></View><Text style={s.live}>● LIVE</Text></View>
        <HealthBars />
        {[['payments-api', 'Degraded', C.amber], ['checkout-web', 'Operational', C.green], ['order-events', 'Degraded', C.amber], ['identity', 'Operational', C.green]].map(row => <View key={row[0]} style={s.serviceRow}><View style={[s.serviceDot, { backgroundColor: row[2] }]} /><Text style={s.serviceName}>{row[0]}</Text><Text style={s.serviceState}>{row[1]}</Text></View>)}
      </View>
    </View>

    <View style={s.panel}>
      <View style={s.rowBetween}><View><Text style={s.sectionTitle}>Incident timeline</Text><Text style={s.sectionSub}>INC-284 · synchronized event stream</Text></View><Text style={s.export}>EXPORT ↗</Text></View>
      {timeline.map((event, index) => <View key={event[0]} style={s.timelineRow}><Text style={s.time}>{event[0]}</Text><View style={s.timelineRail}><View style={s.timelineDot} />{index < timeline.length - 1 && <View style={s.rail} />}</View><View style={s.timelineBody}><Text style={s.timelineTitle}>{event[1]}</Text><Text style={s.timelineMeta}>{event[2]}</Text></View></View>)}
    </View>
    <Text style={s.footer}>RELAY OPS  •  INCIDENT COMMAND WITHOUT THE NOISE  •  DEMO ENVIRONMENT</Text>
  </ScrollView></SafeAreaView>;
}

const s = StyleSheet.create({
  safe:{flex:1,backgroundColor:C.bg},page:{width:'100%',maxWidth:1180,alignSelf:'center',padding:24,gap:20},header:{flexDirection:'row',justifyContent:'space-between',alignItems:'center',paddingBottom:16,borderBottomWidth:1,borderBottomColor:C.line},brandRow:{flexDirection:'row',alignItems:'center',gap:12},brandMark:{width:38,height:38,borderRadius:11,backgroundColor:C.violet,alignItems:'center',justifyContent:'center'},brandGlyph:{color:C.bg,fontWeight:'900',fontSize:19},brand:{color:C.text,fontWeight:'900',letterSpacing:2,fontSize:14},workspace:{color:C.muted,fontSize:9,letterSpacing:1.1,marginTop:3},headerRight:{flexDirection:'row',alignItems:'center',gap:12},onCall:{flexDirection:'row',alignItems:'center',gap:7},greenDot:{width:7,height:7,borderRadius:4,backgroundColor:C.green},onCallText:{color:C.muted,fontSize:9,fontWeight:'800'},avatar:{width:38,height:38,borderRadius:19,borderWidth:1,borderColor:C.line,alignItems:'center',justifyContent:'center'},avatarText:{color:C.text,fontSize:11,fontWeight:'900'},
  hero:{flexDirection:'row',justifyContent:'space-between',alignItems:'flex-end',gap:16,marginVertical:8},kicker:{color:C.cyan,fontWeight:'900',fontSize:10,letterSpacing:1.8},title:{color:C.text,fontSize:36,fontWeight:'800',letterSpacing:-1.1,marginTop:7},subtitle:{color:C.muted,fontSize:14,marginTop:7},primaryButton:{backgroundColor:C.red,paddingHorizontal:18,paddingVertical:13,borderRadius:10},ackButton:{backgroundColor:C.green},primaryButtonText:{color:C.bg,fontWeight:'900',fontSize:10,letterSpacing:.8},
  metrics:{flexDirection:'row',gap:12},wrap:{flexWrap:'wrap'},metric:{flex:1,minWidth:155,backgroundColor:C.panel,borderWidth:1,borderColor:C.line,borderRadius:16,padding:16},metricDot:{width:7,height:7,borderRadius:4,marginBottom:13},metricLabel:{color:C.muted,fontSize:9,fontWeight:'900',letterSpacing:1.2},metricValue:{color:C.text,fontSize:24,fontWeight:'800',marginTop:8},metricMeta:{color:C.muted,fontSize:10,marginTop:5},
  mainGrid:{flexDirection:'row',gap:16,alignItems:'flex-start'},stack:{flexDirection:'column'},full:{width:'100%'},left:{flex:1.5},right:{flex:1},panel:{backgroundColor:C.panel,borderWidth:1,borderColor:C.line,borderRadius:18,padding:19},rowBetween:{flexDirection:'row',justifyContent:'space-between',alignItems:'center',gap:12},sectionTitle:{color:C.text,fontSize:17,fontWeight:'800'},sectionSub:{color:C.muted,fontSize:11,marginTop:4},filters:{flexDirection:'row',backgroundColor:C.bg,borderRadius:9,padding:3},filter:{paddingHorizontal:10,paddingVertical:6,borderRadius:7},filterActive:{backgroundColor:C.violet},filterText:{color:C.muted,fontSize:9,fontWeight:'800'},filterTextActive:{color:C.bg},
  incident:{flexDirection:'row',alignItems:'flex-start',gap:12,paddingVertical:18},borderTop:{borderTopWidth:1,borderTopColor:C.line},severity:{width:34,height:26,borderRadius:7,alignItems:'center',justifyContent:'center'},severityText:{color:C.bg,fontWeight:'900',fontSize:10},incidentBody:{flex:1},incidentTitle:{color:C.text,fontWeight:'800',fontSize:13},incidentMeta:{color:C.muted,fontSize:10,marginTop:5},ownerRow:{flexDirection:'row',alignItems:'center',gap:8,marginTop:10},owner:{width:25,height:25,borderRadius:13,backgroundColor:'#30284B',alignItems:'center',justifyContent:'center'},ownerText:{color:C.violet,fontSize:8,fontWeight:'900'},status:{color:C.cyan,fontSize:9,fontWeight:'800'},resolveButton:{borderWidth:1,borderColor:C.line,borderRadius:8,padding:8},resolveText:{color:C.muted,fontSize:8,fontWeight:'900'},empty:{alignItems:'center',padding:34},emptyIcon:{color:C.green,fontSize:32},emptyTitle:{color:C.text,fontWeight:'800',marginTop:8},
  live:{color:C.green,fontSize:9,fontWeight:'900'},healthBars:{height:90,flexDirection:'row',alignItems:'flex-end',gap:4,marginVertical:20},healthBar:{flex:1,borderRadius:2,opacity:.8},serviceRow:{flexDirection:'row',alignItems:'center',paddingVertical:10,borderTopWidth:1,borderTopColor:C.line},serviceDot:{width:7,height:7,borderRadius:4,marginRight:9},serviceName:{color:C.text,fontSize:11,flex:1,fontWeight:'700'},serviceState:{color:C.muted,fontSize:10},
  serviceState2:{color:C.muted,fontSize:10},export:{color:C.cyan,fontSize:9,fontWeight:'900'},timelineRow:{flexDirection:'row',minHeight:66,paddingTop:15},time:{color:C.muted,fontSize:10,width:48},timelineRail:{width:24,alignItems:'center'},timelineDot:{width:9,height:9,borderRadius:5,backgroundColor:C.violet,borderWidth:2,borderColor:'#3D315E'},rail:{width:1,backgroundColor:C.line,flex:1},timelineBody:{flex:1,paddingBottom:14},timelineTitle:{color:C.text,fontSize:12,fontWeight:'700'},timelineMeta:{color:C.muted,fontSize:10,marginTop:5},footer:{color:'#475064',textAlign:'center',fontSize:8,fontWeight:'800',letterSpacing:1.7,marginVertical:8},
});
