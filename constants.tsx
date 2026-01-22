
import { InspectionSection } from './types';

export interface MachineInventoryItem {
  id: string;
  name: string;
  type: string;
  chassis: string;
  plate: string;
  notes: string;
  color?: string; // Optional property for machine color identification
}

export const MACHINE_INVENTORY: MachineInventoryItem[] = [
  { id: "TR-1", name: "KIPPERTRUCK DAF CF85.430", type: "DUMP TRUCK", chassis: "XLRAD85XC0E668639", plate: "7676KV", notes: "" },
  { id: "TR-2", name: "KIPPERTRUCK DAF CF85", type: "DUMP TRUCK", chassis: "XLRAD85XC0E691514", plate: "7575KV", notes: "" },
  { id: "TR-3", name: "KIPPERTRUCK DAF CF 85.430", type: "DUMP TRUCK", chassis: "XLRAD85XC0E726810", plate: "9696KV", notes: "" },
  { id: "EX-1", name: "EXCAVATOR HITACHI ZX210LC-3", type: "GRAAFMACHINE", chassis: "HCMBFF00C00207790", plate: "", notes: "" },
  { id: "EX-2", name: "EXCAVATOR HITACHI ZX350LC-3", type: "GRAAFMACHINE", chassis: "HCMBFP00P00054918", plate: "", notes: "OUD (MET HEKWERK)" },
  { id: "EX-3", name: "EXCAVATOR HITACHI ZX350LC-3", type: "GRAAFMACHINE", chassis: "HCMBFP00A00058457", plate: "", notes: "NIEUW" },
  { id: "EX-4", name: "EXCAVATOR HITACHI ZX470LCH-3", type: "GRAAFMACHINE", chassis: "HCM1J200E00020471", plate: "", notes: "" },
  { id: "EX-5", name: "EXCAVATOR HITACHI ZX470LCH-3", type: "GRAAFMACHINE", chassis: "HCM1J200L00021925", plate: "", notes: "" },
  { id: "LD-1", name: "DOOSAN DL500", type: "LOADER", chassis: "DHKHLAF0T70005038", plate: "", notes: "OUD" },
  { id: "LD-2", name: "WHEELLOADER DOOSAN DL503", type: "LOADER", chassis: "11781", plate: "", notes: "NIEUW" },
  { id: "ADT-1", name: "DUMPTRUCK TEREX TA30", type: "DUMPTRUCK TEREX", chassis: "A8941378", plate: "", notes: "" },
  { id: "ADT-2", name: "DUMPERTRUCK TEREX TA30RS 6X6", type: "DUMPTRUCK TEREX", chassis: "A9081041", plate: "", notes: "" },
  { id: "ADT-3", name: "DUMPTRUCK TEREX TA30", type: "DUMPTRUCK TEREX", chassis: "A8971032", plate: "", notes: "" },
  { id: "D-1", name: "KOMATSU D65PX16", type: "BULLDOZER", chassis: "KMT0D114H01080316", plate: "", notes: "" },
  { id: "ATV-1", name: "HONDA RANCHER 4X4 ATV", type: "ATV", chassis: "1HFTE4408RJ002320", plate: "", notes: "Machine ID: ATV-1", color: "GROEN" },
  { id: "ATV-2", name: "HONDA RANCHER 4X4 ATV", type: "ATV", chassis: "1HFTE4406RJ001764", plate: "", notes: "Machine ID: ATV-2", color: "ROOD" },
  { id: "ATV-3", name: "HONDA RANCHER 4X4 ATV", type: "ATV", chassis: "1HFTE400XRJ003796", plate: "", notes: "Machine ID: ATV-3", color: "CRÈME" },
  { id: "ATV-4", name: "HONDA RANCHER 4X4 ATV", type: "ATV", chassis: "1HFTE40K2R4005056", plate: "", notes: "Machine ID: ATV-4", color: "ROOD" },
  { id: "V-1", name: "TOYOTA HILUX VIGO", type: "PICKUP", chassis: "MROFR29G601016310", plate: "92-00 KV", notes: "" },
  { id: "V-2", name: "TOYOTA HILUX VIGO", type: "PICKUP", chassis: "MROFR29G801023243", plate: "0007 LV", notes: "" },
  { id: "FT-1", name: "MERCEDES-BENZ TRUCK AXOR 1833", type: "TANKER", chassis: "WDF9525621B978961", plate: "", notes: "" },
  { id: "TR-MAN-1", name: "TRUCK MAN TGA 33.480 6X6", type: "TRUCK", chassis: "WMAH55ZZ25M400020", plate: "", notes: "" },
  { id: "BB-1", name: "YAMAHA 200 AET", type: "BUITENBOORD MOTOR", chassis: "6G6UL700680", plate: "", notes: "" },
  { id: "BB-2", name: "YAMAHA 30 11MH", type: "BUITENBOORD MOTOR", chassis: "S1321732", plate: "", notes: "" },
  { id: "BB-3", name: "YAMAHA 75 PK", type: "BUITENBOORD MOTOR", chassis: "", plate: "", notes: "" },
  { id: "BB-4", name: "200PK YAMAHA BUITENBOORD MOTOR", type: "BUITENBOORD MOTOR", chassis: "6G6X504416", plate: "", notes: "" },
  { id: "COMP-1", name: "XCMG X5203J ROLLER COMPACTOR", type: "STAMPER", chassis: "XK06-002-00098", plate: "", notes: "" },
  { id: "GR-1", name: "XCMG GR215 GRADER", type: "MOTOR GRADER", chassis: "VB-220-570-63-C5-504-0000", plate: "", notes: "" },
  { id: "GEN-1", name: "DIESEL GENERATOR", type: "DIESEL GENERATOR", chassis: "BS192F240308002", plate: "", notes: "BS8500" },
  { id: "WGEN-2", name: "DIESEL WELDING GENERATOR", type: "WELDING GENERATOR", chassis: "HP23092480", plate: "", notes: "HP6500CXE-W" },
  { id: "GEN-3", name: "GENERATOR L35M", type: "DIESEL GENERATOR", chassis: "CC2021090", plate: "", notes: "BLAUW" },
  { id: "GEN-4", name: "GENERATOR ZS1105", type: "DIESEL COMPRESSOR", chassis: "CM23035095", plate: "", notes: "BLAUW" },
  { id: "GEN-5", name: "NITROLUX 2", type: "GENERATOR", chassis: "CM3500", plate: "", notes: "" },
  { id: "GEN-6", name: "GENERATOR", type: "GENERATOR", chassis: "ST170 2024051099", plate: "", notes: "GASOLINE" },
  { id: "STIHL-1", name: "STIHL KETTINGZAAG MS 661", type: "KETTINGZAAG", chassis: "", plate: "", notes: "" },
  { id: "STIHL-2", name: "STIHL KETTINGZAAG MS 661", type: "KETTINGZAAG", chassis: "", plate: "", notes: "" },
  { id: "HPW-1", name: "HIGHPRESSURE WASHER CPPW3200-II", type: "PRESSURE WASHER", chassis: "CP170F211200326", plate: "", notes: "GASOLINE" },
  { id: "TRAIL-1", name: "LOWBED SEMI TRAILER", type: "TRAILER", chassis: "LA9940438S0SYT016", plate: "", notes: "" }
];

export const INITIAL_SECTIONS: InspectionSection[] = [
  {
    title: "EXTERIEUR – VOORZIJDE",
    items: [
      { id: "ext-dak-v", label: "Dak voorzijde", rating: 0, notes: "", photos: [] },
      { id: "ext-zonnedak", label: "Zonnedak", rating: 0, notes: "", photos: [] },
      { id: "ext-v-ruit", label: "Voorruit (lassen of verwisselen)", rating: 0, notes: "", photos: [] },
      { id: "ext-antenne", label: "Antenne", rating: 0, notes: "", photos: [] },
      { id: "ext-wissers", label: "Ruitenwissers", rating: 0, notes: "", photos: [] },
      { id: "ext-wisser-dop", label: "Ruitenwisser dop", rating: 0, notes: "", photos: [] },
      { id: "ext-motorkap", label: "Motorkap", rating: 0, notes: "", photos: [] },
      { id: "ext-hood-pomp", label: "Hood pomp", rating: 0, notes: "", photos: [] },
      { id: "ext-koplampen", label: "Koplampen (standaard / xenon)", rating: 0, notes: "", photos: [] },
      { id: "ext-grill", label: "Grill", rating: 0, notes: "", photos: [] },
      { id: "ext-logo-v", label: "Logo (voorzijde)", rating: 0, notes: "", photos: [] },
      { id: "ext-bumper-v", label: "Bumper (voorzijde)", rating: 0, notes: "", photos: [] },
      { id: "ext-bumper-ant", label: "Bumper antenne", rating: 0, notes: "", photos: [] },
      { id: "ext-bumper-dop", label: "Bumper dop", rating: 0, notes: "", photos: [] },
      { id: "ext-bumper-refl", label: "Bumper reflector", rating: 0, notes: "", photos: [] },
      { id: "ext-bumper-roos", label: "Bumper rooster / reflector", rating: 0, notes: "", photos: [] },
      { id: "ext-mistlamp", label: "Mistlamp / mistlampkap", rating: 0, notes: "", photos: [] }
    ]
  },
  {
    title: "EXTERIEUR – ACHTERZIJDE",
    items: [
      { id: "ext-dak-a", label: "Dak achterzijde", rating: 0, notes: "", photos: [] },
      { id: "ext-a-ruit", label: "Achterruit", rating: 0, notes: "", photos: [] },
      { id: "ext-wisser-a", label: "Ruitenwisser (achter)", rating: 0, notes: "", photos: [] },
      { id: "ext-wisser-dop-a", label: "Ruitenwisser dop (achter)", rating: 0, notes: "", photos: [] },
      { id: "ext-kofferbak", label: "Kofferbak", rating: 0, notes: "", photos: [] },
      { id: "ext-spoiler", label: "Spoiler", rating: 0, notes: "", photos: [] },
      { id: "ext-logo-a", label: "Logo (achterzijde)", rating: 0, notes: "", photos: [] },
      { id: "ext-achterlicht", label: "Achterlicht", rating: 0, notes: "", photos: [] },
      { id: "ext-bumper-a", label: "Bumper (achterzijde)", rating: 0, notes: "", photos: [] },
      { id: "ext-trekhaak-dop", label: "Trekhaak dop", rating: 0, notes: "", photos: [] }
    ]
  },
  {
    title: "RECHTERZIJDE – BESTUURDERSKANT",
    items: [
      { id: "r-hoekspiegel", label: "Hoekspiegel", rating: 0, notes: "", photos: [] },
      { id: "r-hoekspiegelkap", label: "Hoekspiegelkap", rating: 0, notes: "", photos: [] },
      { id: "r-dak", label: "Dak rechterzijde", rating: 0, notes: "", photos: [] },
      { id: "r-voorvendel", label: "Voorvendel (rechts)", rating: 0, notes: "", photos: [] },
      { id: "r-chassis-kap", label: "Chassisnummer kap", rating: 0, notes: "", photos: [] },
      { id: "r-vendel-knipper", label: "Vendel knipperlicht (rechts)", rating: 0, notes: "", photos: [] },
      { id: "r-regenkap-v", label: "Regenkap voor (rechts)", rating: 0, notes: "", photos: [] },
      { id: "r-regenkap-a", label: "Regenkap achter (rechts)", rating: 0, notes: "", photos: [] },
      { id: "r-spiegelkap", label: "Zijspiegelkap (rechts)", rating: 0, notes: "", photos: [] },
      { id: "r-spiegelglas", label: "Zijspiegelglas (rechts)", rating: 0, notes: "", photos: [] },
      { id: "r-spiegel-richting", label: "Zijspiegel richtingwijzer (rechts)", rating: 0, notes: "", photos: [] },
      { id: "r-ruit-v", label: "Ruit voordeur (rechts)", rating: 0, notes: "", photos: [] },
      { id: "r-rubber-v", label: "Ruitrubber voor (rechts)", rating: 0, notes: "", photos: [] },
      { id: "r-ruit-a", label: "Ruit achterdeur (rechts)", rating: 0, notes: "", photos: [] },
      { id: "r-rubber-a", label: "Ruitrubber achter (rechts)", rating: 0, notes: "", photos: [] },
      { id: "r-voordeur", label: "Voordeur (rechts)", rating: 0, notes: "", photos: [] },
      { id: "r-achterdeur", label: "Achterdeur (rechts)", rating: 0, notes: "", photos: [] },
      { id: "r-hendel-v", label: "Hendel voordeur (rechts)", rating: 0, notes: "", photos: [] },
      { id: "r-hendel-a", label: "Hendel achterdeur (rechts)", rating: 0, notes: "", photos: [] },
      { id: "r-rechtsbalk", label: "Rechtsbalk", rating: 0, notes: "", photos: [] },
      { id: "r-achtervendel", label: "Achtervendel (rechts)", rating: 0, notes: "", photos: [] }
    ]
  },
  {
    title: "LINKERZIJDE – PASSAGIERSKANT",
    items: [
      { id: "l-dak", label: "Dak linkerzijde", rating: 0, notes: "", photos: [] },
      { id: "l-voorvendel", label: "Voorvendel (links)", rating: 0, notes: "", photos: [] },
      { id: "l-vendel-knipper", label: "Vendel knipperlicht (links)", rating: 0, notes: "", photos: [] },
      { id: "l-regenkap-v", label: "Regenkap voor (links)", rating: 0, notes: "", photos: [] },
      { id: "l-regenkap-a", label: "Regenkap achter (links)", rating: 0, notes: "", photos: [] },
      { id: "l-spiegelkap", label: "Zijspiegelkap (links)", rating: 0, notes: "", photos: [] },
      { id: "l-spiegelglas", label: "Zijspiegelglas (links)", rating: 0, notes: "", photos: [] },
      { id: "l-spiegel-richting", label: "Zijspiegel richtingwijzer (links)", rating: 0, notes: "", photos: [] },
      { id: "l-ruit-v", label: "Ruit voordeur (links)", rating: 0, notes: "", photos: [] },
      { id: "l-rubber-v", label: "Ruitrubber voor (links)", rating: 0, notes: "", photos: [] },
      { id: "l-ruit-a", label: "Ruit achterdeur (links)", rating: 0, notes: "", photos: [] },
      { id: "l-rubber-a", label: "Ruitrubber achter (links)", rating: 0, notes: "", photos: [] },
      { id: "l-voordeur", label: "Voordeur (links)", rating: 0, notes: "", photos: [] },
      { id: "l-achterdeur", label: "Achterdeur (links)", rating: 0, notes: "", photos: [] },
      { id: "l-hendel-v", label: "Hendel voordeur (links)", rating: 0, notes: "", photos: [] },
      { id: "l-hendel-a", label: "Hendel achterdeur (links)", rating: 0, notes: "", photos: [] },
      { id: "l-linksbalk", label: "Linksbalk", rating: 0, notes: "", photos: [] },
      { id: "l-achtervendel", label: "Achtervendel (links)", rating: 0, notes: "", photos: [] }
    ]
  },
  {
    title: "BIJZONDERHEDEN / BUITEN",
    items: [
      { id: "extra-bodykit", label: "Body-kit (rondom / voor / achter / links / rechts)", rating: 0, notes: "", photos: [] },
      { id: "extra-velgen", label: "Sportvelgen / velgdoppen / wieldoppen", rating: 0, notes: "", photos: [] },
      { id: "extra-roofrek", label: "Roofrek", rating: 0, notes: "", photos: [] },
      { id: "extra-batterij", label: "Batterij", rating: 0, notes: "", photos: [] }
    ]
  },
  {
    title: "INTERIEUR",
    items: [
      { id: "int-zonnescherm", label: "Zonnescherm", rating: 0, notes: "", photos: [] },
      { id: "int-plafond-licht", label: "Plafond licht", rating: 0, notes: "", photos: [] },
      { id: "int-deurpanelen-a", label: "Deurpanelen achter", rating: 0, notes: "", photos: [] },
      { id: "int-deurpanelen-v", label: "Deurpanelen voor", rating: 0, notes: "", photos: [] },
      { id: "int-binnenspiegel", label: "Binnenspiegel", rating: 0, notes: "", photos: [] },
      { id: "int-dashboard-glas", label: "Dashboard glass", rating: 0, notes: "", photos: [] },
      { id: "int-toeter", label: "Toeter", rating: 0, notes: "", photos: [] },
      { id: "int-mat-v", label: "Vloermat voor", rating: 0, notes: "", photos: [] },
      { id: "int-mat-a", label: "Vloermat achter", rating: 0, notes: "", photos: [] },
      { id: "int-seatbelt-v", label: "Seatbelt voor", rating: 0, notes: "", photos: [] },
      { id: "int-seatbelt-a", label: "Seatbelt achter", rating: 0, notes: "", photos: [] },
      { id: "int-hoofdsteun-v", label: "Hoofdsteun voor", rating: 0, notes: "", photos: [] },
      { id: "int-hoofdsteun-a", label: "Hoofdsteun achter", rating: 0, notes: "", photos: [] },
      { id: "int-bekleding-v", label: "Bekleding voor", rating: 0, notes: "", photos: [] },
      { id: "int-bekleding-a", label: "Bekleding achter", rating: 0, notes: "", photos: [] },
      { id: "int-dpaneel-licht-v", label: "D.paneel licht voor", rating: 0, notes: "", photos: [] },
      { id: "int-dpaneel-licht-a", label: "D.paneel licht achter", rating: 0, notes: "", photos: [] },
      { id: "int-airco", label: "Airco rooster", rating: 0, notes: "", photos: [] },
      { id: "int-pook", label: "Versnellingspook", rating: 0, notes: "", photos: [] },
      { id: "int-koffermat", label: "Kofferbak mat", rating: 0, notes: "", photos: [] },
      { id: "int-reserveband", label: "Reserveband", rating: 0, notes: "", photos: [] },
      { id: "int-wielsok", label: "Wielsok", rating: 0, notes: "", photos: [] },
      { id: "int-batterijklem", label: "Batterijklem", rating: 0, notes: "", photos: [] },
      { id: "int-lighter", label: "Lighter / dop", rating: 0, notes: "", photos: [] },
      { id: "int-asbak", label: "Asbak / muntbak", rating: 0, notes: "", photos: [] },
      { id: "int-jack", label: "Jack", rating: 0, notes: "", photos: [] },
      { id: "int-draaier", label: "Draaier", rating: 0, notes: "", photos: [] },
      { id: "int-trekhaak-int", label: "Trekhaak (interieur indicatie)", rating: 0, notes: "", photos: [] },
      { id: "int-deck", label: "Deck (aanwezigheid + type)", rating: 0, notes: "", photos: [] },
      { id: "int-versterker", label: "Versterker", rating: 0, notes: "", photos: [] },
      { id: "int-sdkaart", label: "SD-kaart", rating: 0, notes: "", photos: [] },
      { id: "int-remote", label: "Remote", rating: 0, notes: "", photos: [] },
      { id: "int-stoelen-elec", label: "Voorstoelen elektrisch (ja/nee)", rating: 0, notes: "", photos: [] }
    ]
  }
];

export const STATUS_CODES = [
  { code: "√", label: "Goed / Aanwezig", color: "bg-emerald-500 text-white" },
  { code: "O", label: "Ontbreekt", color: "bg-amber-500 text-white" },
  { code: "K", label: "Kapot", color: "bg-rose-500 text-white" },
  { code: "D", label: "Defect", color: "bg-purple-500 text-white" },
  { code: "X", label: "Niet Aanwezig", color: "bg-slate-400 text-white" },
  { code: "B", label: "Barst", color: "bg-orange-500 text-white" },
  { code: "nvt", label: "N.V.T.", color: "bg-slate-200 text-slate-500" }
];

export const DAMAGE_CODES = [
  { code: "1", label: "Kleine deuk", color: "bg-blue-100 text-blue-700" },
  { code: "2", label: "Grote deuk", color: "bg-blue-200 text-blue-800" },
  { id: "3", code: "3", label: "Lichte krasjes", color: "bg-blue-300 text-blue-900" },
  { code: "4", label: "Diepe krasjes", color: "bg-blue-400 text-white" },
  { code: "5", label: "Verkleurd / Roest", color: "bg-rose-600 text-white" }
];
