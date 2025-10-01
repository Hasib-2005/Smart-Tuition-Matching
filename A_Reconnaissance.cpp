#include <bits/stdc++.h>
using namespace std;
#define nl "\n"
#define int long long
#define yes cout<<"YES"<< nl;
#define no cout<<"NO"<< nl;
#define pb push_back
#define ppb pop_back
#define pii pair<int,int>
#define vpii vector<pair<int,int>>
#define vi vector<int>
#define si set<int>
#define mii map<int,int>
#define ip(x) for(auto &it : x) cin>>it 
#define all(x) x.begin(),x.end()
#define sz(x) ((int)x.size())
// Mohammad Hasibur Rahman

void solve(){
    int n,k; cin >> n >> k;
    vi v(n);
    ip(v);
    int cnt = 0;
    for(int i=0; i<n; i++){
        for(int j=i+1; j<n; j++){
            if(abs(v[i]-v[j])<=k) cnt++;
        }
    }
    cout << 2*cnt << nl;
}
signed main(){
    ios::sync_with_stdio(false);
    cin.tie(0);

    solve(); 
}